const jwt = require('jsonwebtoken');
const { readDB, writeDB } = require('../config/db');
const ROLES = require('../constants/roles');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

exports.register = (req, res) => {
  const { name, email, password } = req.body;
  const db = readDB();

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nombre, correo y contraseña son obligatorios' });
  }

  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Correo ya registrado' });
  }

  const user = {
    id: Date.now(),
    name,
    email,
    password, // texto plano para simplificar
    role: ROLES.USER
  };

  db.users.push(user);
  writeDB(db);

  res.status(201).json({ message: 'Usuario registrado con éxito' });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  const db = readDB();

  const user = db.users.find(u => u.email === email);
  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  if (user.password !== password) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '12h' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};
