require('dotenv').config();


const knex = require('knex')({
  
    client: 'mysql2',
    connection: {
      host: 'localhost',
      user: 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: './migrations'
    }

});

module.exports = knex;
