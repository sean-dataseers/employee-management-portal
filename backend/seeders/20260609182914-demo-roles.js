'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      { name: 'Admin',    created_at: new Date(), updated_at: new Date() },
      { name: 'Manager',  created_at: new Date(), updated_at: new Date() },
      { name: 'Employee', created_at: new Date(), updated_at: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  },
};
