'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('PaymentRefunds', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      event: {
        type: Sequelize.STRING
      },
      ticketNo: {
        type: Sequelize.STRING
      },
      paymentID: {
        type: Sequelize.STRING
      },
      organizer: {
        type: Sequelize.STRING
      },
      refundID: {
        type: Sequelize.INTEGER
      },
      accountID: {
        type: Sequelize.INTEGER
      },
      txID: {
        type: Sequelize.INTEGER
      },
      flwRef: {
        type: Sequelize.STRING
      },
      refID: {
        type: Sequelize.STRING
      },
      walletID: {
        type: Sequelize.INTEGER
      },
      amountRefunded: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.STRING
      },
      meta: {
        type: Sequelize.JSON
      },
      customer: {
        type: Sequelize.JSON
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('PaymentRefunds');
  }
};
