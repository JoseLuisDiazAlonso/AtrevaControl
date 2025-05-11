//Creamos un middleware epara verificar el token o JWT
import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).json({ message: 'Token no proporcionado' });

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY || 'tu_clave_secreta');
        req.user = decoded; //aquí guardamos los datos decodificados del token
        next(); //Pasamos al siguiente middleware o ruta;
    } catch (err) {
        return res.status(403).json({ message: 'Token inválido' });
    }
};

export default authMiddleware;