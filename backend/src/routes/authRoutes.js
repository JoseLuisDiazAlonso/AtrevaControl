import express from 'express';
import bcrypt from 'bcryptjs'; // Para la comparación de contraseñas
import jwt from 'jsonwebtoken'; // Para generar tokens
import pool from '../db.js'; // Conexión a la base de datos

const router = express.Router();
router.post('/login', async (req, res) => {
  const { usuario, password } = req.body;

  console.log("Datos recibidos del cliente:", req.body);

  // Verificar si los datos son válidos
  if (!usuario || !password) {
    return res.status(400).json({ message: 'Por favor, ingresa nombre de usuario y contraseña' });
  }

  try {
    // Consulta actualizada: utilizamos 'usuario' en vez de 'nombre_usuario'
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);

    if (rows.length === 0) {
      console.log("authRoutes: Usuario no encontrado");
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const user = rows[0]; // Primer usuario encontrado
    console.log("authRoutes: compare pass: ", password, "with entered: ", user.password);
    const isMatch = await bcrypt.compare(password, user.password); // Comparar la contraseña

    if (!isMatch) {
      console.log("authRoutes: password dont match");
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user.id, usuario: user.usuario }, process.env.SECRET_KEY || 'tu_clave_secreta', { expiresIn: '1h' });

    res.json({ message: 'Login exitoso', token }); // Responder con el token

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }

});

export default router;
