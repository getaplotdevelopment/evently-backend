'use strict';
module.exports = (sequelize, DataTypes) => {
  const PaymentEvents = sequelize.define('PaymentEvents', {
    paymentID: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ticketNo: {
      type: DataTypes.STRING,
      references: { model: 'Ticket', key: 'id' }
    },
    amount: DataTypes.STRING,
    organizer: DataTypes.STRING,
    event: {
      type: DataTypes.STRING,
      references: { model: 'Event', key: 'slug' }
    },
    transactionID: DataTypes.STRING,
    attendanceStatus: DataTypes.STRING,
    customer: DataTypes.JSON,
    paymentMethod: DataTypes.STRING,
    refID: {
      type: DataTypes.STRING,
      references: { model: 'PaymentRequests', key: 'refId' }
    }
  }, {});
  PaymentEvents.associate = function(models) {
    // associations can be defined here
    PaymentEvents.belongsTo(models.Event, {
      as: 'events',
      foreignKey: 'event',
      onDelete: 'CASCADE'
    });
    PaymentEvents.belongsTo(models.Ticket, {
      as: 'paymentTicket',
      foreignKey: 'ticketNo',
      onDelete: 'CASCADE'
    });
    PaymentEvents.belongsTo(models.PaymentRequests, {
      as: 'paymentToRequests',
      foreignKey: 'refID',
      onDelete: 'CASCADE'
    });
  };
  return PaymentEvents;
};
