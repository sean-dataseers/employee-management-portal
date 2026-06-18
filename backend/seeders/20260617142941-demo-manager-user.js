'use strict';
const { Op } = require('sequelize');

const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'Manager' LIMIT 1;`
    );

    const [employeeRoles] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'Employee' LIMIT 1;`
    );

    const managerRoleId = roles[0].id;
    const employeeRoleId = employeeRoles[0].id;


    const hashedPassword = await bcrypt.hash('manager123',10);
    const hashedPasswordEmployee = await bcrypt.hash('employee123',10)

    await queryInterface.bulkInsert('users', [
        {
          username:'manager',
          password: hashedPassword,
          role_id: managerRoleId,
          created_at: new Date(),
          updated_at: new Date(),
       },
       {
          username:'employee',
          password: hashedPasswordEmployee,
          role_id: employeeRoleId,
          created_at: new Date(),
          updated_at: new Date(),
       },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { username: { [Op.in]: ['manager', 'employee'] } }, {});
  }
};
