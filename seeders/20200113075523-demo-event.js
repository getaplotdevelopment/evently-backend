'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Events', [{
        slug: 'slug-123456',
        title: 'its a title',
        description: 'short desc',
        tagList: ['first'],
        category: 'cat',
        eventImage: 'http',
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
    
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Events', null, {});
    
  }
};