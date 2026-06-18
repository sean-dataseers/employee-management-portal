'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('departments', [
      { name: 'Engineering', description: 'Engineering department', created_at: new Date(), updated_at: new Date() },
      { name: 'Operations',  description: 'Operations department',  created_at: new Date(), updated_at: new Date() },
      { name: 'Support',     description: 'Support department',     created_at: new Date(), updated_at: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('departments', null, {});
  },
};