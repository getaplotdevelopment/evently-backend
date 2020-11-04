'use strict';
module.exports = (sequelize, DataTypes) => {
  const PaymentEvents = sequelize.define(
    'PaymentEvents',
    {
      paymentID: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      ticketNo: {
        type: DataTypes.INTEGER,
        references: { model: 'Ticket', key: 'id' }
      },
      amount: DataTypes.STRING,
      organizer: {
        type: DataTypes.INTEGER,
        references: { model: 'Users', key: 'id' }
      },
      event: {
        type: DataTypes.STRING,
        references: { model: 'Event', key: 'slug' }
      },
      transactionID: DataTypes.STRING,
      attendanceStatus: DataTypes.STRING,
      customer: DataTypes.JSON,
      paymentMethod: DataTypes.STRING,
      vCode: DataTypes.INTEGER,
      qrCode: DataTypes.STRING,
      expireBy: DataTypes.DATE,
      refID: {
        type: DataTypes.STRING,
        references: { model: 'PaymentRequests', key: 'refId' }
      },
      user: {
        type: DataTypes.INTEGER,
        references: { model: 'Users', key: 'id' }
      },
      isTicketVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {}
  );
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
    PaymentEvents.belongsTo(models.User, {
      as: 'eventUser',
      foreignKey: 'user',
      onDelete: 'CASCADE'
    });
    PaymentEvents.belongsTo(models.User, {
      as: 'eventOrganizer',
      foreignKey: 'organizer',
      onDelete: 'CASCADE'
    });
    PaymentEvents.hasMany(models.FeaturedEvents, {
      foreignKey: 'amount'
    });
  };
  return PaymentEvents;
};
