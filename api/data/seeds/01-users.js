exports.seed = async (knex) => {
  await knex('user').insert([
    {
      username: 'test-user',
      password: '$2a$08$0RHIxvCtB99KpwKT4Wd63uC0M90P/HOU0AL7Bsyk7ClJUsrBbBPra',
      email: 'test@email.com',
    },
  ]);
};
