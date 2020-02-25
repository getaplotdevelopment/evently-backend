module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'TicketCategories',
      'user',
      Sequelize.INTEGER
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'TicketCategories',
      'user',
      Sequelize.INTEGER
    );
  }
};
