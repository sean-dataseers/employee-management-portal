const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');
const {
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
} = require('../controllers/departmentController');

router.post('/', authenticate, authorize(['admin']), createDepartment);
router.get('/', authenticate, getDepartments);
router.put('/:id', authenticate, authorize(['admin']), updateDepartment);
router.delete('/:id', authenticate, authorize(['admin']), deleteDepartment);

module.exports = router;