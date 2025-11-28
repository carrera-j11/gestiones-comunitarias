const router = require('express').Router();
const {
  listMyReservations,
  listAllReservations,
  createReservation,
  updateReservationStatus,
  cancelReservation,
  getReservationReport
} = require('../controllers/reservationController');
const { authRequired, hasRole, ROLES } = require('../middleware/authMiddleware');

// USER: ver sus reservas
router.get('/mine', authRequired, hasRole(ROLES.USER), listMyReservations);

// ADMIN/RESPONSABLE: ver todas
router.get('/', authRequired, hasRole(ROLES.ADMIN, ROLES.RESPONSABLE), listAllReservations);

// REPORTES: ADMIN y RESPONSABLE
router.get('/report', authRequired, hasRole(ROLES.ADMIN, ROLES.RESPONSABLE), getReservationReport);

// USER: crear reserva
router.post('/', authRequired, hasRole(ROLES.USER), createReservation);

// ADMIN: aprobar / rechazar (solo pendientes)
router.put('/:id/status', authRequired, hasRole(ROLES.ADMIN), updateReservationStatus);

// USER: cancelar reserva aprobada
router.put('/:id/cancel', authRequired, hasRole(ROLES.USER), cancelReservation);

module.exports = router;
