require('dotenv').config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'secretsecret',
  NODE_ENV: process.env.NODE_ENV || 'development',
  DEV_DATABASE_URL: process.env.DEV_DATABASE_URL,
  TESTING_DATABASE_URL: process.env.TESTING_DATABASE_URL,
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS) || 10,
  PORT: process.env.PORT,
  TEST_TOKEN: process.env.TEST_TOKEN,
  BAD_TOKEN: process.env.BAD_TOKEN,
  SEED_PASS_1: process.env.SEED_PASS_1,
  SEED_PASS_2: process.env.SEED_PASS_2,
};
