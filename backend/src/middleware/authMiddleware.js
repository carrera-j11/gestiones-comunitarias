const jwt = require('jsonwebtoken');
const ROLES = require('../constants/roles');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

function authRequired(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Token no enviado' });
  }
  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Formato de token inválido' });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    console.error('Error verificando token', err);
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

function hasRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'No tienes permisos suficientes' });
    }
    next();
  };
}

module.exports = { authRequired, hasRole, ROLES };
