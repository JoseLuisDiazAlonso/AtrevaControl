import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from '../backend/src/routes/authRoutes.js';
import rutasRoutes from '../backend/src/routes/rutasRoutes.js'; // <--- AÑADIDO

const app = express();

// Configuración de CORS
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Rutas de autenticación
app.use('/api/auth', authRoutes);

//  Rutas para guardar rutas (la que usa el botón "Guardar en BD")
app.use('/rutas', rutasRoutes); // <--- AÑADIDO

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Servidor corriendo en puerto ${PORT}`);
});


