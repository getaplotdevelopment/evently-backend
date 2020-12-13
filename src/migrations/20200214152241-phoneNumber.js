module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Users', 'phoneNumber', Sequelize.STRING),
      queryInterface.addColumn('Users', 'location', Sequelize.JSON)
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Users', 'phoneNumber', Sequelize.STRING),
      queryInterface.removeColumn('Users', 'location', Sequelize.JSON)
    ]);
  }
};
