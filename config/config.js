import 'dotenv/config';

module.exports = {
  development: {
    username: process.env.USERNAME_DEV,
    password: process.env.PASSWORD_DEV,
    database: process.env.DB_DEV,
    host: 'host.docker.internal', // use 127.0.0.1 for npm run commands
    dialect: 'postgres',
    logging: false
  },
  test: {
    username: process.env.USERNAME_TEST,
    password: process.env.PASSWORD_TEST,
    database: process.env.DB_TEST,
    host: 'host.docker.internal',
    dialect: 'postgres',
    logging: false
  },
  production: {
    username: process.env.USERNAME_PRODUCTION,
    password: process.env.PASSWORD_PRODUCTION,
    database: process.env.DB_PRODUCTION,
    host: process.env.DB_HOSTNAME,
    dialect: 'postgres',
    logging: false
  },
  email: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASS
  }
};
