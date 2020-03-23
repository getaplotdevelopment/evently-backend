'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Events', 'availableTickets', Sequelize.ARRAY(Sequelize.JSON)),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Events', 'availableTickets', Sequelize.ARRAY(Sequelize.JSON)),
    ]);
  }
};
