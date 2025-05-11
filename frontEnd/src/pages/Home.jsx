import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Formulario from '../components/formulario';
import Tabla from '../components/tabla';
import GraficoMeses from '../components/GraficaMes';
import '../css/home.css';

const Home = () => {
  const navigate = useNavigate();
  const [datos, setDatos] = useState([]);

  const token = localStorage.getItem('token');

  // Redirige si no hay token
  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [navigate, token]);

  //  Función para cargar desde BD
  const cargarDatosDesdeBD = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/rutas/obtener', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDatos(response.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  }, [token]);

  //  Cargar al montar
  useEffect(() => {
    cargarDatosDesdeBD();
  }, [cargarDatosDesdeBD]);

  //  Guardar nuevo dato en BD
  const agregarDato = async (nuevoDato) => {
    try {
      await axios.post('http://localhost:5000/rutas/guardar', [nuevoDato], {
        headers: { Authorization: `Bearer ${token}` }
      });
      cargarDatosDesdeBD(); // Recargar tras guardar
    } catch (error) {
      console.error('Error al guardar nuevo dato:', error);
    }
  };

  return (
    <div className="contenedor">
      <h1>ATHENEA</h1>
      <div className="contenido">
        <Formulario onSubmit={agregarDato} />
        <div className="datos">
          <div className="tabla-container">
            <Tabla
              datos={datos} setDatos={setDatos}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
