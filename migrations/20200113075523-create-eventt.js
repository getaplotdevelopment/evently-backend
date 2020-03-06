module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      slug: {
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      category: {
        type: Sequelize.STRING
      },
      tagList: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      startDate: {
        type: Sequelize.DATE
      },
      finishDate: {
        type: Sequelize.DATE
      },
      startTime: {
        type: Sequelize.STRING
      },
      eventType: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      numberDays: {
        type: Sequelize.STRING
      },
      eventImage: {
        type: Sequelize.STRING
      },
      favorited: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      favoritedCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      organizer: {
        type: Sequelize.STRING,
        model: 'Users',
        key: 'email'
      },
      isDeleted: {
        type: Sequelize.BOOLEAN
      },
      isLiked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      likedBy: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: []
      },
      currentMode: {
        type: Sequelize.STRING,
        defaultValue: 'draft'
      },
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
    return queryInterface.dropTable('Events');
  }
};