module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ReplayExperienceComments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      text: {
        type: Sequelize.TEXT
      },
      img: {
        type: Sequelize.STRING
      },
      user: {
        type: Sequelize.INTEGER
      },
      experienceComment: {
        type: Sequelize.INTEGER
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ReplayExperienceComments');
  }
};
