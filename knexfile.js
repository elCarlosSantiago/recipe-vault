require('dotenv').config();
const { DATABASE_URL, DEV_DATABASE_URL, TEST_DATABASE_URL } = require('./api/secrets');
const pg = require('pg');

if (DATABASE_URL) {
  pg.defaults.ssl = { rejectUnauthorized: false };
}

const sharedConfig = {
  client: 'pg',
  migrations: { directory: './api/data/migrations' },
  seeds: { directory: './api/data/seeds' },
};

module.exports = {
  development: {
    ...sharedConfig,
    connection: DEV_DATABASE_URL,
  },
  test: {
    ...sharedConfig,
    connection: TEST_DATABASE_URL,
  },
  production: {
    ...sharedConfig,
    connection: DATABASE_URL,
    pool: { min: 2, max: 10 },
  },
};
