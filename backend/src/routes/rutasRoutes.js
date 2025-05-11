import express from 'express';
import pool from '../db.js';
import verificarToken from '../middleware/auth.js';

const router = express.Router();

// Función para calcular el tiempo en clientes (mismo que en frontend)
const calcularTiempo = (hora_llegada, hora_salida) => {
  if (!hora_llegada || !hora_salida || hora_llegada.length !== 5 || hora_salida.length !== 5) return null;
  const [h1, m1] = hora_llegada.split(':').map(Number);
  const [h2, m2] = hora_salida.split(':').map(Number);
  const totalMin = (h2 * 60 + m2) - (h1 * 60 + m1);
  if (totalMin < 0) return null;
  const horas = Math.floor(totalMin / 60);
  const minutos = totalMin % 60;
  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:00`;
};

// Obtener todos los registros
router.get('/obtener', verificarToken, async (req, res) => {
  try {
    const [filas] = await pool.query('SELECT * FROM rutas ORDER BY fecha ASC');
    res.json(filas);
  } catch (error) {
    console.error('Error al obtener registros:', error);
    res.status(500).json({ message: 'Error al obtener registros', error: error.message });
  }
});

// Insertar múltiples registros
router.post('/guardar', verificarToken, async (req, res) => {
  const datos = req.body;

  if (!Array.isArray(datos)) {
    return res.status(400).json({ message: 'Se esperaba un array de datos' });
  }

  try {
    const sql = `
      INSERT INTO rutas 
      (fecha, conductor, ruta, cliente, hora_llegada, hora_salida, tiempo_en_clientes, matricula)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const insertados = [];

    for (const d of datos) {
      const tiempoEnClientes = calcularTiempo(d.hora_llegada, d.hora_salida);

      const valores = [
        d.fecha,
        d.conductor,
        d.ruta,
        d.cliente,
        d.hora_llegada,
        d.hora_salida,
        tiempoEnClientes,  // Asignar el tiempo calculado
        d.matricula,
      ];
      const [resultado] = await pool.query(sql, valores);

      insertados.push({
        id: resultado.insertId,
        ...d,
        tiempo_en_clientes: tiempoEnClientes,  // Asegurarse de que el tiempo esté disponible
      });
    }

    res.status(201).json({ message: 'Registros insertados correctamente', datos: insertados });
  } catch (error) {
    console.error('Error al insertar registros:', error);
    res.status(500).json({ message: 'Error al insertar registros', error: error.message });
  }
});

// Editar un registro por ID
router.put('/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const d = req.body;

    // Calcular el tiempo en clientes
    const tiempo_en_clientes = calcularTiempo(d.hora_llegada, d.hora_salida);

    const [resultado] = await pool.query(`
      UPDATE rutas SET 
        fecha = ?, conductor = ?, ruta = ?, cliente = ?, 
        hora_llegada = ?, hora_salida = ?, tiempo_en_clientes = ?, matricula = ? 
      WHERE id = ?`,
      [
        d.fecha,
        d.conductor,
        d.ruta,
        d.cliente,
        d.hora_llegada,
        d.hora_salida,
        tiempo_en_clientes,
        d.matricula,
        id
      ]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ message: 'No se encontró el registro para actualizar' });
    }

    res.json({ message: 'Registro actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar:', error);
    res.status(500).json({ message: 'Error al actualizar', error: error.message });
  }
});

// Eliminar un registro por ID
router.delete('/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [resultado] = await pool.query('DELETE FROM rutas WHERE id = ?', [id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ message: 'No se encontró el registro para eliminar' });
    }

    res.json({ message: 'Registro eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar:', error);
    res.status(500).json({ message: 'Error al eliminar', error: error.message });
  }
});

export default router;
