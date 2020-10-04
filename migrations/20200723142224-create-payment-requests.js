'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('PaymentRequests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      verificationId: {
        type: Sequelize.STRING
      },
      refId: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.INTEGER
      },
      eventStatus: {
        type: Sequelize.STRING
      },
      customer: {
        type: Sequelize.JSON
      },
      paymentType: {
        type: Sequelize.STRING
      },
      user: {
        type: Sequelize.INTEGER
      },
      organizer: {
        type: Sequelize.INTEGER
      },
      ticketIds: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
      },
      event: {
        type: Sequelize.STRING
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
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('PaymentRequests');
  }
};
