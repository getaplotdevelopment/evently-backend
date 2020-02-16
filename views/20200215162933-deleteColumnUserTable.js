module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Users', 'isAdmin', Sequelize.BOOLEAN),
      queryInterface.removeColumn('Users', 'isOrganizer', Sequelize.BOOLEAN)
    ]);
  }

  // down: (queryInterface, Sequelize) => {
  //   return Promise.all([
  //     queryInterface.removeColumn('Users', 'isAdmin', Sequelize.BOOLEAN),
  //     queryInterface.removeColumn('Users', 'isOrganizer', Sequelize.BOOLEAN)
  //   ]);
  // }
};
