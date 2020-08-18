module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CommentExperiences', {
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
      isHidden: {
        type: Sequelize.BOOLEAN
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      user: {
        type: Sequelize.INTEGER
      },
      experience: { type: Sequelize.INTEGER },
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
    await queryInterface.dropTable('CommentExperiences');
  }
};
