module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Tickets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.INTEGER
      },
      ticketNumber: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.STRING
      },
      category: {
        type: Sequelize.INTEGER
      },
      organizer: {
        type: Sequelize.INTEGER
      },
      event: {
        type: Sequelize.STRING
      },
      isTicketVerified: {
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Tickets');
  }
};
