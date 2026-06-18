const db = require('../models');

// CREATE
const createRole = async (req, res) => {
  try {
    const { name, permission_level} = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    const role = await db.Role.create({ name , permission_level});
    return res.status(201).json(role);
  } catch (error) {
    console.error('Create role error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// READ
const getRoles = async (req, res) => {
  try {
    const roles = await db.Role.findAll();
    return res.json(roles);
  } catch (error) {
    console.error('Get roles error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name , permission_level } = req.body;

    const role = await db.Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    role.name = name ?? role.name;
    role.permission_level = permission_level ?? role.permission_level;
    await role.save();

    return res.json(role);
  } catch (error) {
    console.error('Update role error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// DELETE
const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await db.Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    await role.destroy();
    return res.json({ message: 'Role deleted' });
  } catch (error) {
    console.error('Delete role error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createRole, getRoles, updateRole, deleteRole };