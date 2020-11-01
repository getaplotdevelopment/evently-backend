"use strict";

module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    message: DataTypes.STRING,
    user: DataTypes.INTEGER
  });

  Message.associate = models => {
    Message.belongsTo(models.User, {
      as: 'owner',
      foreignKey: 'user',
      onDelte: 'CASCADE'
    });
  };

  return Message;
};