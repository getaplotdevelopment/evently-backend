module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('OrganizerProfiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      accountName: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      domain: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      profilePhoto: {
        type: Sequelize.STRING
      },
      coverPhoto: {
        type: Sequelize.STRING
      },
      preferences: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      lastLogin: {
        type: Sequelize.DATE
      },
      accountType: {
        type: Sequelize.STRING
      },
      social: {
        type: Sequelize.JSON
      },
      organizer: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('OrganizerProfiles');
  }
};
