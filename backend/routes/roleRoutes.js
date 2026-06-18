const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');
const {
    createRole,
    getRoles,
    updateRole,
    deleteRole,
} = require('../controllers/roleController');

router.post('/', authenticate, authorize(['admin']), createRole);
router.get('/', authenticate, getRoles);
router.put('/:id', authenticate, authorize(['admin']), updateRole);
router.delete('/:id', authenticate, authorize(['admin']), deleteRole);

module.exports = router;