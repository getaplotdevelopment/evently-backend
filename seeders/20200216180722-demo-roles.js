module.exports = {
  up: (queryInterface, Sequelize) => {
    const newRoles = [];
    const roles = [
      { designation: 'USER' },
      { designation: 'ORGANIZER' },
      { designation: 'SUPER USER' },
      { designation: 'EVENTS' },
      { designation: 'ACCOUNTS' }
    ];
    roles.map(role => {
      const seedData = {
        designation: role.designation,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      return newRoles.push(seedData);
    });
    return queryInterface.bulkInsert('Roles', newRoles, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Roles', null, {});
  }
};
