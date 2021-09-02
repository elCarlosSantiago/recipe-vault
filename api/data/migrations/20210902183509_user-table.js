exports.up = async  (knex) => {
  await knex.schema.createTable('user', (tbl) => {
    tbl.increments('user_id');
    tbl.string('username', 25).notNullable().unique();
    tbl.string('password', 100).notNullable();
    tbl.string('email', 40).notNullable().unique();
    tbl.timestamps(false, true);
  });
};

exports.down = async (knex) =>  {
  await knex.schema.dropTableIfExists('user')
};
