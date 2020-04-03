module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Users', 'isApproved', Sequelize.BOOLEAN);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Users',
      'isApproved',
      Sequelize.BOOLEAN
    );
  }
};
