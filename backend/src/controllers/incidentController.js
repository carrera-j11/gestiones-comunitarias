const { readDB, writeDB } = require('../config/db');

// Listar todos los incidentes (ADMIN / RESPONSABLE)
exports.listIncidents = (req, res) => {
  const db = readDB();
  res.json(db.incidents);
};

// Crear incidente (USER) asociado a un espacio
exports.createIncident = (req, res) => {
  const { spaceId, description } = req.body;

  if (!spaceId || !description) {
    return res.status(400).json({ error: 'Espacio y descripción son obligatorios' });
  }

  const db = readDB();
  const space = db.spaces.find(s => s.id === Number(spaceId));
  if (!space) {
    return res.status(404).json({ error: 'Espacio no encontrado' });
  }

  const incident = {
    id: Date.now(),
    userId: req.user.id,
    spaceId: space.id,
    description,
    status: 'ABIERTO',
    actionNote: null,
    createdAt: new Date().toISOString()
  };

  db.incidents.push(incident);
  writeDB(db);

  res.status(201).json(incident);
};

// Actualizar estado (RESPONSABLE) + nota de acción
exports.updateIncidentStatus = (req, res) => {
  const { id } = req.params;
  const { status, actionNote } = req.body;
  const valid = ['ABIERTO', 'EN_PROCESO', 'RESUELTO'];

  if (!valid.includes(status)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }

  if (!actionNote) {
    return res.status(400).json({ error: 'Debe registrar la acción realizada' });
  }

  const db = readDB();
  const incident = db.incidents.find(i => i.id === Number(id));

  if (!incident) {
    return res.status(404).json({ error: 'Incidente no encontrado' });
  }

  if (incident.status === 'RESUELTO') {
    return res.status(400).json({ error: 'El incidente ya está resuelto' });
  }

  // Transiciones básicas
  if (incident.status === 'ABIERTO' && status === 'RESUELTO') {
    // se permite pasar directo a RESUELTO
  } else if (incident.status === 'ABIERTO' && status === 'EN_PROCESO') {
    // OK
  } else if (incident.status === 'EN_PROCESO' && status === 'RESUELTO') {
    // OK
  } else if (incident.status === status) {
    // mismo estado, se permite actualizar solo la nota
  } else {
    return res.status(400).json({ error: 'Transición de estado no permitida' });
  }

  incident.status = status;
  incident.actionNote = actionNote;
  writeDB(db);

  res.json(incident);
};
