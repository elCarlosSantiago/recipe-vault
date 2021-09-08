const knex = require('knex');
const configs = require('../../knexfile');
const { NODE_ENV } = require('../secrets');


module.exports = knex(configs[NODE_ENV]);
