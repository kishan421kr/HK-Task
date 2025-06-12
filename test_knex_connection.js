const knex = require('./knexfile');

knex.raw('SELECT 1+1 as result')
  .then((result) => {
    console.log('Knex raw query successful:', result[0][0].result);
  })
  .catch((err) => {
    console.error('Knex raw query failed:', err);
  })
  .finally(() => {
    knex.destroy();
  });
