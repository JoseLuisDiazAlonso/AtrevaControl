// backend/scripts/hashPassword.js

import bcrypt from 'bcryptjs';

const contraseñaPlana = 'Control2025!';
const saltRounds = 10;

bcrypt.hash(contraseñaPlana, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error al generar el hash:', err);
    return;
  }
  console.log("Contraseña original:", contraseñaPlana);
  console.log("Contraseña hasheada:", hash);
});
