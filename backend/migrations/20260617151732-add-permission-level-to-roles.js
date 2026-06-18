'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.addColumn('roles', 'permission_level', {
  type: Sequelize.STRING,
  allowNull: false,
  defaultValue: 'employee'
  
});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('roles', 'permission_level',
)}
};
