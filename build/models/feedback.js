"use strict";

module.exports = (sequelize, DataTypes) => {
  const Feedback = sequelize.define('Feedback', {
    subject: DataTypes.STRING,
    content: DataTypes.STRING,
    user: DataTypes.INTEGER
  }, {});

  Feedback.associate = function (models) {
    Feedback.belongsTo(models.User, {
      as: 'owner',
      foreignKey: 'user',
      onDelete: 'CASCADE'
    });
  };

  return Feedback;
};