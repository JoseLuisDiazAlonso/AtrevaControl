import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Definición de los colores a usar para los diferentes clientes
const colores = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a0522d', '#6a5acd',
  '#20b2aa', '#ff69b4', '#8a2be2', '#00ced1', '#ff6347', '#3cb371'
];

// Función para obtener el mes y el año a partir de una fecha
const obtenerMes = (fecha) => {
  const d = new Date(fecha);
  return `${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;
};

const GraficoMeses = ({ datos }) => {
  // Agrupar los datos por mes y por cliente
  const agrupados = {};

  datos.forEach(d => {
    const mes = obtenerMes(d.fecha); // Agrupar por mes (ej. "May 2025")
    if (!agrupados[mes]) agrupados[mes] = {};
    
    // Calcular el tiempo en minutos entre la hora de llegada y salida
    const tiempoEnMinutos = (new Date(`1970-01-01T${d.hora_salida}`) - new Date(`1970-01-01T${d.hora_llegada}`)) / 60000;
    
    // Sumar el tiempo de ese cliente para el mes correspondiente
    agrupados[mes][d.cliente] = (agrupados[mes][d.cliente] || 0) + tiempoEnMinutos;
  });

  // Transformar el objeto agrupado en un arreglo que pueda ser usado por el gráfico
  const dataFinal = Object.entries(agrupados).map(([mes, clientes]) => ({
    mes,
    ...clientes
  }));

  // Obtener los clientes únicos
  const clientesUnicos = [...new Set(datos.map(d => d.cliente))];

  return (
    <div style={{ height: 400 }}>
      <h3>Promedio por mes</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dataFinal}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Legend />
          {/* Crear una barra para cada cliente con su respectivo color */}
          {clientesUnicos.map((cliente, i) => (
            <Bar key={cliente} dataKey={cliente} fill={colores[i % colores.length]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoMeses;
