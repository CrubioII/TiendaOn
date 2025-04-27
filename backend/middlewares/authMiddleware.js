const jwt = require('jsonwebtoken');
const SECRET_KEY = 'clave_secreta_para_jwt';

module.exports = (requiredRole) => (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (requiredRole && decoded.role !== requiredRole) {
      return res.status(403).json({ error: 'No tienes permisos' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};