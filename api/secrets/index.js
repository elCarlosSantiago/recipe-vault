module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'secretsecret',
  NODE_ENV: process.env.NODE_ENV || 'development',
  DEV_DATABASE_URL: process.env.DEV_DATABASE_URL,
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL,
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS) || 8,
  PORT: process.env.PORT,
};
