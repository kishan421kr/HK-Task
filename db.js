
const model = require("objection");
const knex = require("./knexfile");


model.Model.knex(knex);

module.exports = knex