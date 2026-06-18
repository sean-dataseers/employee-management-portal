const db = require('../models');
const { Op } = require('sequelize');

// CREATE
const createEmployee = async (req, res) => {
  try {
    const { first_name, last_name, email, job_title, department_id, role_id, status } = req.body;

    if (!first_name || !last_name || !email) {
      return res.status(400).json({ message: 'First name, last name, and email are required' });
    }

    const employee = await db.Employee.create({
      first_name,
      last_name,
      email,
      job_title,
      department_id,
      role_id,
      status: status || 'Active',
    });

    return res.status(201).json(employee);
  } catch (error) {
    console.error('Create employee error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// READ (with search + pagination)
const getEmployees = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const offset = (page - 1) * limit;

    const where = search
      ? {
          [Op.or]: [
            { first_name: { [Op.like]: `%${search}%` } },
            { last_name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const { count, rows } = await db.Employee.findAndCountAll({
      where,
      include: [
        { model: db.Department },
        { model: db.Role },
      ],
      limit,
      offset,
      order: [['id', 'ASC']],
    });

    return res.json({
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      employees: rows,
    });
  } catch (error) {
    console.error('Get employees error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
//UPDATE 
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, job_title, department_id, role_id, status } = req.body;

    const employee = await db.Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    employee.first_name = first_name ?? employee.first_name;
    employee.last_name = last_name ?? employee.last_name;
    employee.email = email ?? employee.email;
    employee.job_title = job_title ?? employee.job_title;
    employee.department_id = department_id ?? employee.department_id;
    employee.role_id = (req.user.permission_level === 'admin') ? (role_id ?? employee.role_id) : employee.role_id;
    if (employee.user_id && req.user.permission_level === 'admin') {
      const userRecord = await db.User.findByPk(employee.user_id)
      userRecord.role_id = employee.role_id
      await userRecord.save();
    }
    employee.status = status ?? employee.status;

    await employee.save();

    return res.json(employee);
  } catch (error) {
    console.error('Update employee error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// DEACTIVATE (instead of delete)
const deactivateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await db.Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    employee.status = 'Inactive';
    await employee.save();

    return res.json({ message: 'Employee deactivated', employee });
  } catch (error) {
    console.error('Deactivate employee error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createEmployee, getEmployees, updateEmployee, deactivateEmployee };