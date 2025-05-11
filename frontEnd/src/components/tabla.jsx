import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import GraficoMes from './GraficaMes';

const Tabla = ({ datos, setDatos }) => {
  const [filtros, setFiltros] = useState({
    cliente: 'Todos',
    conductor: 'Todos',
    ruta: 'Todos',
  });

  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES');
  };

  const calcularTiempo = (llegada, salida) => {
    if (!llegada || !salida || llegada.length !== 5 || salida.length !== 5) return null;
    const [h1, m1] = llegada.split(':').map(Number);
    const [h2, m2] = salida.split(':').map(Number);
    const totalMin = (h2 * 60 + m2) - (h1 * 60 + m1);
    if (totalMin < 0) return null;
    const horas = Math.floor(totalMin / 60);
    const minutos = totalMin % 60;
    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:00`;
  };

  const filtrarDatos = () => {
    return datos.filter((d) =>
      (filtros.cliente === 'Todos' || d.cliente === filtros.cliente) &&
      (filtros.conductor === 'Todos' || d.conductor === filtros.conductor) &&
      (filtros.ruta === 'Todos' || d.ruta === filtros.ruta)
    );
  };

  const handleChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const exportarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Datos');
    XLSX.writeFile(wb, 'datos.xlsx');
  };

  const importarExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target.result;
      const wb = XLSX.read(data, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(ws);
      setDatos(jsonData);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <h2>Tabla de datos</h2>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <label>
          Cliente:
          <select name="cliente" value={filtros.cliente} onChange={handleChange}>
            <option value="Todos">Todos</option>
            {Array.from(new Set(datos.map((d) => d.cliente))).map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </label>
        <label>
          Conductor:
          <select name="conductor" value={filtros.conductor} onChange={handleChange}>
            <option value="Todos">Todos</option>
            {Array.from(new Set(datos.map((d) => d.conductor))).map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </label>
        <label>
          Ruta:
          <select name="ruta" value={filtros.ruta} onChange={handleChange}>
            <option value="Todos">Todas</option>
            {Array.from(new Set(datos.map((d) => d.ruta))).map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <button onClick={exportarExcel}>Exportar a Excel</button>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={importarExcel}
          style={{ marginLeft: '10px' }}
        />
      </div>

      <table border="1" width="100%">
        <thead>
          <tr style={{ backgroundColor: '#007BFF', color: 'white' }}>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Conductor</th>
            <th>Ruta</th>
            <th>Matrícula</th>
            <th>Hora Llegada</th>
            <th>Hora Salida</th>
            <th>Tiempo</th>
          </tr>
        </thead>
        <tbody>
          {filtrarDatos().map((item, i) => (
            <tr key={item.id} style={{ backgroundColor: i % 2 === 0 ? '#f0f8ff' : '#e6f2ff' }}>
              <td>{formatearFecha(item.fecha)}</td>
              <td>{item.cliente}</td>
              <td>{item.conductor}</td>
              <td>{item.ruta}</td>
              <td>{item.matricula}</td>
              <td>{item.hora_llegada}</td>
              <td>{item.hora_salida}</td>
              <td>{item.tiempo_en_clientes || calcularTiempo(item.hora_llegada, item.hora_salida) || 'No disponible'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <GraficoMes datos={filtrarDatos()} />
    </div>
  );
};

export default Tabla;
