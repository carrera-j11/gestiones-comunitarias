const { readDB, writeDB } = require('../config/db');

// Reservas del usuario logueado
exports.listMyReservations = (req, res) => {
  const db = readDB();
  const my = db.reservations.filter(r => r.userId === req.user.id);
  res.json(my);
};

// Todas las reservas (para ADMIN / RESPONSABLE)
exports.listAllReservations = (req, res) => {
  const db = readDB();
  res.json(db.reservations);
};

// Crear nueva reserva (USER)
exports.createReservation = (req, res) => {
  const { spaceId, date, startTime, endTime, purpose } = req.body;

  if (!spaceId || !date || !startTime || !endTime || !purpose) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const db = readDB();
  const space = db.spaces.find(s => s.id === Number(spaceId));
  if (!space) {
    return res.status(404).json({ error: 'Espacio no encontrado' });
  }

  // (Opcional) Validar que la hora fin sea posterior a la hora inicio
  if (startTime >= endTime) {
    return res.status(400).json({ error: 'La hora de fin debe ser mayor a la hora de inicio' });
  }

  const reservation = {
    id: Date.now(),
    spaceId: space.id,
    userId: req.user.id,
    date,          // YYYY-MM-DD
    startTime,     // HH:mm
    endTime,       // HH:mm
    purpose,
    status: 'PENDIENTE',
    cancelReason: null
  };

  db.reservations.push(reservation);
  writeDB(db);

  res.status(201).json(reservation);
};

// Cambiar estado (solo ADMIN, solo si está PENDIENTE)
exports.updateReservationStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const valid = ['PENDIENTE', 'APROBADA', 'RECHAZADA'];

  if (!valid.includes(status)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }

  const db = readDB();
  const reservation = db.reservations.find(r => r.id === Number(id));

  if (!reservation) {
    return res.status(404).json({ error: 'Reserva no encontrada' });
  }

  if (reservation.status !== 'PENDIENTE') {
    return res.status(400).json({ error: 'Solo reservas pendientes pueden cambiar de estado' });
  }

  reservation.status = status;
  writeDB(db);
  res.json(reservation);
};

// Cancelar reserva (USER) solo si está APROBADA
exports.cancelReservation = (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!reason) {
    return res.status(400).json({ error: 'Debe indicar el motivo de cancelación' });
  }

  const db = readDB();
  const reservation = db.reservations.find(r => r.id === Number(id));

  if (!reservation) {
    return res.status(404).json({ error: 'Reserva no encontrada' });
  }

  if (reservation.userId !== req.user.id) {
    return res.status(403).json({ error: 'No puede cancelar reservas de otros usuarios' });
  }

  if (reservation.status !== 'APROBADA') {
    return res.status(400).json({ error: 'Solo se pueden cancelar reservas aprobadas' });
  }

  reservation.status = 'CANCELADA';
  reservation.cancelReason = reason;
  writeDB(db);

  res.json(reservation);
};

// Reporte de reservas (ADMIN / RESPONSABLE)
exports.getReservationReport = (req, res) => {
  const db = readDB();

  const total = db.reservations.length;
  const byStatus = {};
  const bySpace = {};

  db.reservations.forEach(r => {
    byStatus[r.status] = (byStatus[r.status] || 0) + 1;

    const space = db.spaces.find(s => s.id === r.spaceId);
    const key = String(r.spaceId);

    if (!bySpace[key]) {
      bySpace[key] = {
        spaceId: r.spaceId,
        spaceName: space ? space.name : `Espacio #${r.spaceId}`,
        total: 0
      };
    }
    bySpace[key].total += 1;
  });

  res.json({
    total,
    byStatus,
    bySpace: Object.values(bySpace)
  });
};
