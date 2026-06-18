'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Employee.belongsTo(models.Department, { foreignKey: 'department_id' });
      Employee.belongsTo(models.Role, { foreignKey: 'role_id' });
      Employee.belongsTo(models.User, {foreignKey: 'user_id'});
    }
  }
  Employee.init({
    user_id: DataTypes.INTEGER,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    job_title: DataTypes.STRING,
    department_id: DataTypes.INTEGER,
    role_id: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Employee',
    underscored: true,
  });
  return Employee;
};