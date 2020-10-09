'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('FeaturedEvents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      eventSlug: {
        type: Sequelize.STRING
      },
      eventName: Sequelize.STRING,
      startDate: Sequelize.DATE,
      finishDate: Sequelize.DATE,
      amount: {
        type: Sequelize.INTEGER
      },
      featuredDays: {
        type: Sequelize.INTEGER
      },
      featuredStatus: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      verificationId: Sequelize.STRING,
      refId: Sequelize.STRING,
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
    return queryInterface.dropTable('FeaturedEvents');
  }
};
