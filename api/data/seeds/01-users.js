exports.seed = async (knex) => {
  await knex('user').insert([
    {
      username: 'test-user',
      password: '$2a$08$281Vl7CZCKgfpbI4Vqlq1e1rwc748U4ow6JhJOjoK4kJMcks9rCNa', // password "Test1234."
      email: 'test@email.com',
    },
  ]);
};
