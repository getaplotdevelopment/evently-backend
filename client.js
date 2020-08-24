const { Client } = require('pg');

const pgclient = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: 'postgres',
    password: 'postgres',
    database: 'postgres'
});

pgclient.connect();

const table = 'CREATE TABLE Users(id SERIAL PRIMARY KEY, firstName VARCHAR(40) NOT NULL, lastName VARCHAR(40) NOT NULL, role INT, password VARCHAR(80), email VARCHAR(40))'
const text = 'INSERT INTO Users(firstname, lastname, role, password, email) VALUES($1, $2, $3, $4, $5) RETURNING *'
const values = ['evently', 'uder', 1, 'password', 'user@gmail.com']

pgclient.query(table, (err, res, next) => {
  if (err) next(err);
});

pgclient.query(text, values, (err, res) => {
  if (err) throw err;
});

pgclient.query('SELECT * FROM Users', (err, res) => {
  if (err) throw err
  console.log(err, res.rows) // Print the data in student table
  pgclient.end()
});
