const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readDB, writeDB } = require('../config/db');
const ROLES = require('../constants/roles');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

/**
 * Registro de usuario
 * - Valida campos
 * - Evita correos duplicados
 * - Asigna rol según correo
 * - Hashea contraseña con bcrypt
 */
exports.register = (req, res) => {
  const { name, email, password } = req.body;
  const db = readDB();

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: 'Nombre, correo y contraseña son obligatorios' });
  }

  const existing = db.users.find(u => u.email === email);
  if (existing) {
    return res.status(400).json({ error: 'Correo ya registrado' });
  }

  // ¿ya existe algún admin en la BD?
  const alreadyHasAdmin = db.users.some(u => u.role === ROLES.ADMIN);

  // Rol por defecto
  let role = ROLES.USER;

  // Si aún no hay admin y se registra con este correo -> ADMIN
  if (!alreadyHasAdmin && email === 'admin@municipio.gob') {
    role = ROLES.ADMIN;
  }
  // Correos especiales para responsable
  else if (
    email === 'responsable@municipio.gob' ||
    email === 'resp@municipio.gob'
  ) {
    role = ROLES.RESPONSABLE;
  }

  // Hashear contraseña
  const hashedPassword = bcrypt.hashSync(password, 10);

  const user = {
    id: Date.now(),
    name,
    email,
    password: hashedPassword,
    role
  };

  db.users.push(user);
  writeDB(db);

  return res.status(201).json({
    message: 'Usuario registrado con éxito',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};

/**
 * Login
 * - Busca por email
 * - Compara password con bcrypt
 * - Devuelve JWT + datos básicos
 */
exports.login = (req, res) => {
  const { email, password } = req.body;
  const db = readDB();

  const user = db.users.find(u => u.email === email);
  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  const ok = bcrypt.compareSync(password, user.password);
  if (!ok) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: '12h' }
  );

  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};
