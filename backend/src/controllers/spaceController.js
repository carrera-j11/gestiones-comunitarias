const { readDB, writeDB } = require('../config/db');

exports.listSpaces = (req, res) => {
  const db = readDB();
  res.json(db.spaces);
};

exports.createSpace = (req, res) => {
  const { name, type, location, capacity } = req.body;
  if (!name || !type || !location || !capacity) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const db = readDB();

  const space = {
    id: Date.now(),
    name,
    type,
    location,
    capacity: Number(capacity),
    isActive: true
  };

  db.spaces.push(space);
  writeDB(db);

  res.status(201).json(space);
};
