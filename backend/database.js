const knex = require('knex');
const config = require('./knexfile');

// Initialize Knex with the development configuration
const db = knex(config.development);

module.exports = db;