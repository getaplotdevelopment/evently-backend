'use strict';

module.exports = (sequelize, DataTypes) => {
  const PaymentRefunds = sequelize.define('PaymentRefunds', {
    event: {
      type: DataTypes.STRING,
      references: {
        model: 'Event',
        key: 'slug'
      }
    },
    ticketNo: {
      type: DataTypes.STRING,
      references: {
        model: 'Ticket',
        key: 'id'
      }
    },
    paymentID: DataTypes.STRING,
    organizer: DataTypes.STRING,
    refundID: DataTypes.INTEGER,
    accountID: DataTypes.INTEGER,
    txID: DataTypes.INTEGER,
    flwRef: DataTypes.STRING,
    walletID: DataTypes.INTEGER,
    refID: {
      type: DataTypes.STRING,
      references: {
        model: 'PaymentRequests',
        key: 'refId'
      }
    },
    amountRefunded: DataTypes.INTEGER,
    status: DataTypes.STRING,
    meta: DataTypes.JSON,
    customer: DataTypes.JSON
  }, {});

  PaymentRefunds.associate = function (models) {
    // associations can be defined here
    PaymentRefunds.belongsTo(models.Event, {
      as: 'events',
      foreignKey: 'event',
      onDelete: 'CASCADE'
    });
    PaymentRefunds.belongsTo(models.Ticket, {
      as: 'paymentTicket',
      foreignKey: 'ticketNo',
      onDelete: 'CASCADE'
    });
    PaymentRefunds.belongsTo(models.PaymentRequests, {
      as: 'paymentToRequests',
      foreignKey: 'refID',
      onDelete: 'CASCADE'
    });
  };

  return PaymentRefunds;
};