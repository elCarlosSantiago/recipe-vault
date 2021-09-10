require('dotenv').config();
const { SEED_PASS_1, SEED_PASS_2 } = require('../../secrets');

exports.seed = async (knex) => {
  await knex('user').insert([
    {
      username: 'test-user',
      password: SEED_PASS_1,
      email: 'test@email.com',
    },
    {
      username: 'test-user-2',
      password: SEED_PASS_2,
      email: 'test2@email.com',
    },
  ]);
};
