const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');
const {
  createEmployee,
  getEmployees,
  updateEmployee,
  deactivateEmployee,
} = require('../controllers/employeeController');

router.post('/', authenticate, authorize(['admin', 'manager']), createEmployee);
router.get('/', authenticate, getEmployees);
router.put('/:id', authenticate, authorize(['admin', 'manager']), updateEmployee);
router.put('/:id/deactivate', authenticate, authorize(['admin', 'manager']), deactivateEmployee)

module.exports = router;