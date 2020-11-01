"use strict";

module.exports = (sequelize, DataTypes) => {
  const UserActivity = sequelize.define('UserActivity', {
    designation: DataTypes.STRING,
    userId: DataTypes.INTEGER
  });

  UserActivity.associate = models => {
    UserActivity.belongsTo(models.User, {
      as: 'owner',
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };

  return UserActivity;
};