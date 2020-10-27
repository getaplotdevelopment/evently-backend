'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('PaymentEvents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      paymentID: {
        type: Sequelize.STRING
      },
      ticketNo: {
        type: Sequelize.INTEGER
      },
      amount: {
        type: Sequelize.STRING
      },
      organizer: {
        type: Sequelize.INTEGER
      },
      event: {
        type: Sequelize.STRING
      },
      transactionID: {
        type: Sequelize.STRING
      },
      attendanceStatus: {
        type: Sequelize.STRING
      },
      customer: {
        type: Sequelize.JSON
      },
      paymentMethod: {
        type: Sequelize.STRING
      },
      refID: {
        type: Sequelize.STRING
      },
      vCode: {
        type: Sequelize.INTEGER
      },
      qrCode: {
        type: Sequelize.STRING
      },
      user: {
        type: Sequelize.INTEGER
      },
      expireBy: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      isTicketVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('PaymentEvents');
  }
};
