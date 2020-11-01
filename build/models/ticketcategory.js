"use strict";

module.exports = (sequelize, DataTypes) => {
  const TicketCategory = sequelize.define('TicketCategory', {
    designation: DataTypes.STRING,
    isDefault: {
      type: DataTypes.BOOLEAN,
      default: false
    },
    user: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    }
  }, {});

  TicketCategory.associate = function (models) {
    TicketCategory.hasMany(models.Ticket, {
      foreignKey: 'category',
      allowNull: false
    });
    TicketCategory.belongsTo(models.User, {
      as: 'userfkey',
      foreignKey: 'user',
      onDelete: 'CASCADE'
    });
  };

  return TicketCategory;
};