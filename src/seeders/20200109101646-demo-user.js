module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Users',
      [
        {
          firstName: 'John',
          lastName: 'Doe',
          userName: 'John2020',
          email: 'johndoe@test.com',
          password:
            '$2a$10$aTVorj0NuNGlhbWrv0Edv.nNXZmfNyHm3kvms.UF4vO5x5vq2zDay',
          role: 'SUPER USER',
          isActivated: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstName: 'organizer',
          lastName: 'Doe',
          userName: 'organizer1',
          email: 'organizer@test.com',
          password:
            '$2a$10$aTVorj0NuNGlhbWrv0Edv.nNXZmfNyHm3kvms.UF4vO5x5vq2zDay',
          role: 'ORGANIZER',
          isActivated: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstName: 'organizer2',
          lastName: 'Doe2',
          userName: 'organizer2',
          email: 'organizer2@test.com',
          password:
            '$2a$10$aTVorj0NuNGlhbWrv0Edv.nNXZmfNyHm3kvms.UF4vO5x5vq2zDay',
          role: 'ORGANIZER',
          isActivated: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstName: 'user',
          lastName: 'Doe',
          userName: 'user',
          email: 'user@test.com',
          password:
            '$2a$10$aTVorj0NuNGlhbWrv0Edv.nNXZmfNyHm3kvms.UF4vO5x5vq2zDay',
          role: 'USER',
          isActivated: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstName: 'user2',
          lastName: 'Doe2',
          userName: 'user2',
          email: 'user2@test.com',
          password:
            '$2a$10$aTVorj0NuNGlhbWrv0Edv.nNXZmfNyHm3kvms.UF4vO5x5vq2zDay',
          role: 'USER',
          isActivated: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstName: 'user3',
          lastName: 'Doe2',
          userName: 'user3',
          email: 'user3@test.com',
          password:
            '$2a$10$aTVorj0NuNGlhbWrv0Edv.nNXZmfNyHm3kvms.UF4vO5x5vq2zDay',
          role: 'USER',
          isActivated: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
