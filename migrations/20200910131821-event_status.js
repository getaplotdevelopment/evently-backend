module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Events',
      'eventStatus',
      Sequelize.ENUM('canceled', 'paused', 'live', 'postponed')
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Events',
      'eventStatus',
      Sequelize.ENUM('canceled', 'paused', 'live', 'postponed')
    );
  }
};
