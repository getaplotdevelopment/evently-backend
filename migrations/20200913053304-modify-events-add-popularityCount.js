'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.addColumn(
     'Events',
     'popularityCount',
     {
      type: Sequelize.INTEGER,
      defaultValue: 0
      }
    )
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.removeColumn(
    'Events',
    'popularityCount',
    Sequelize.INTEGER
  );
  }
};
