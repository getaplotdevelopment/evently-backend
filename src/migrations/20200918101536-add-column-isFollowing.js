module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Follows',
      'isFollowing',
      Sequelize.BOOLEAN
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Follows',
      'isFollowing',
      Sequelize.BOOLEAN
    );
  }
};
