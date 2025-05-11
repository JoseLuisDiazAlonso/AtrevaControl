import React, { useEffect, useState } from 'react';

const Formulario = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    fecha: '',
    conductor: '',
    ruta: '',
    matricula: '',
    cliente: '',
    hora_llegada: '',
    hora_salida: '',
  });

  useEffect(() => {
    // Si hay datos iniciales (cuando editamos), establecerlos en el estado
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const [error, setError] = useState('');

  // Función para validar solo texto
  const soloTexto = (str) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(str);

  const handleChange = (e) => {
    const { id, name, value } = e.target;
    const key = id || name;
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { fecha, conductor, ruta, matricula, cliente, hora_llegada, hora_salida } = formData;

    const hoy = new Date();
    const fechaSeleccionada = new Date(formData.fecha);

    // Validaciones
    if (!fecha || !conductor || !ruta || !matricula || !cliente || !hora_llegada || !hora_salida) {
      return setError('Todos los campos son obligatorios');
    }

    // Validar que conductor y cliente contengan solo texto
    if (![conductor, cliente].every(soloTexto)) {
      return setError('Conductor y Cliente deben contener solo texto.');
    }

    // Validar que la fecha no sea futura
    if (fechaSeleccionada > hoy) {
      alert("La fecha no puede ser futura");
      return;
    }

    setError('');
    onSubmit(formData);  // Llamada a la función onSubmit pasada como prop

    // Limpiar el formulario después de enviar
    setFormData({
      fecha: '',
      conductor: '',
      ruta: '',
      matricula: '',
      cliente: '',
      hora_llegada: '',
      hora_salida: '',
    });
  };

  return (
    <form className="formulario" onSubmit={handleSubmit}>
      <h1>DATOS RUTAS</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <label htmlFor="fecha">Fecha</label>
      <input type="date" id="fecha" value={formData.fecha} onChange={handleChange} />

      <input
        type="text"
        id="conductor"
        placeholder="Conductor"
        value={formData.conductor}
        onChange={handleChange}
      />

      <input
        type="text"
        id="ruta"
        placeholder="Ruta"
        value={formData.ruta}
        onChange={handleChange}
      />

      <input
        type="text"
        id="matricula"
        placeholder="Matrícula"
        value={formData.matricula}
        onChange={handleChange}
      />

      <input
        type="text"
        id="cliente"
        placeholder="Cliente"
        value={formData.cliente}
        onChange={handleChange}
      />

      <label htmlFor="hora_llegada">Hora de Llegada</label>
      <input
        type="time"
        id="hora_llegada"
        value={formData.hora_llegada}
        onChange={handleChange}
        step="60"
      />

      <label htmlFor="hora_salida">Hora de Salida</label>
      <input
        type="time"
        id="hora_salida"
        value={formData.hora_salida}
        onChange={handleChange}
        step="60"
      />

      <button type="submit">Enviar</button>
    </form>
  );
};

export default Formulario; 