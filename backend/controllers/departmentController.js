const db = require('../models');

// CREATE — add a new department
const createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    const department = await db.Department.create({ name, description });
    return res.status(201).json(department);
  } catch (error) {
    console.error('Create department error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// READ — get all departments
const getDepartments = async (req, res) => {
  try {
    const departments = await db.Department.findAll();
    return res.json(departments);
  } catch (error) {
    console.error('Get departments error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE — edit an existing department
const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const department = await db.Department.findByPk(id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    department.name = name ?? department.name;
    department.description = description ?? department.description;
    await department.save();

    return res.json(department);
  } catch (error) {
    console.error('Update department error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// DELETE — remove a department
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await db.Department.findByPk(id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    await department.destroy();
    return res.json({ message: 'Department deleted' });
  } catch (error) {
    console.error('Delete department error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
};