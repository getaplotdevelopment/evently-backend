'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Friends', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      from: {
        type: Sequelize.INTEGER
      },
      sentTo: {
        type: Sequelize.INTEGER
      },
      sentStatus: {
        type: Sequelize.STRING,
        defaultValue: 'pending'
      },
      requestStatus: {
        type: Sequelize.STRING,
        defaultValue: 'pending'
      },
      receivedStatus: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isFriend: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    return queryInterface.dropTable('Friends');
  }
};
