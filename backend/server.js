/**Configuramos el servidor. Iniciamos el Express y lo ponemos a la escucha de peticiones en un puerto específico. */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from '../backend/src/routes/authRoutes.js'; // Asegúrate de que la ruta esté bien configurada

const app = express();

// Configuración de CORS
const corsOptions = {
  origin: 'http://localhost:5173', // Permite solicitudes solo desde el frontend en localhost:5173
  methods: ['GET', 'POST'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeceras permitidas
};

app.use(cors(corsOptions)); // Usa CORS con las opciones configuradas

app.use(helmet());
app.use(express.json()); // Para procesar el cuerpo de las solicitudes en formato JSON
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Rutas de autenticación
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});




