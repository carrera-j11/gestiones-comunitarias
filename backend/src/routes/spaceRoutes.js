const router = require('express').Router();
const { listSpaces, createSpace } = require('../controllers/spaceController');
const { authRequired, hasRole, ROLES } = require('../middleware/authMiddleware');

router.get('/', authRequired, listSpaces);
router.post('/', authRequired, hasRole(ROLES.ADMIN), createSpace);

module.exports = router;
