const router = require('express').Router();
const {
  listIncidents,
  createIncident,
  updateIncidentStatus
} = require('../controllers/incidentController');
const { authRequired, hasRole, ROLES } = require('../middleware/authMiddleware');

// Ver incidentes: ADMIN y RESPONSABLE
router.get('/', authRequired, hasRole(ROLES.ADMIN, ROLES.RESPONSABLE), listIncidents);

// Crear incidente: USER
router.post('/', authRequired, hasRole(ROLES.USER), createIncident);

// Actualizar estado + nota: RESPONSABLE
router.put('/:id/status', authRequired, hasRole(ROLES.RESPONSABLE), updateIncidentStatus);

module.exports = router;
