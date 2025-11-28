const jwt = require('jsonwebtoken');
const { readDB, writeDB } = require('../config/db');
const ROLES = require('../constants/roles');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

exports.register = (req, res) => {
  const { email, password, name } = req.body;
  const db = readDB();

  // ¿ya existe ese correo?
  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Correo ya registrado' });
  }

  // decidir rol según correo y situación actual
  const alreadyHasAdmin = db.users.some(u => u.role === ROLES.ADMIN);
  let role = ROLES.USER;

  // si aún no hay admin y se registra con este correo -> ADMIN
  if (!alreadyHasAdmin && email === 'admin@municipio.gob') {
    role = ROLES.ADMIN;
  }
  // responsable
  else if (
    email === 'responsable@municipio.gob' ||
    email === 'resp@municipio.gob'
  ) {
    role = ROLES.RESPONSABLE;
  }

  // hashear contraseña
  const hashed = bcrypt.hashSync(password, 10);

  const user = {
    id: Date.now(),
    name,
    email,
    password: hashed,
    role
  };

  db.users.push(user);
  writeDB(db);

  res.json({
    message: 'Usuario registrado',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
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
