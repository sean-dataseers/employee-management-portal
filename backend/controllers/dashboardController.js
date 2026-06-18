const db = require('../models');

const getDashboardStats = async (req, res) => {
  try {
    const totalEmployees = await db.Employee.count();
    const activeEmployees = await db.Employee.count({ where: { status: 'Active' } });
    const inactiveEmployees = await db.Employee.count({ where: { status: 'Inactive' } });
    const totalDepartments = await db.Department.count();

    return res.json({
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      totalDepartments,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDashboardStats };