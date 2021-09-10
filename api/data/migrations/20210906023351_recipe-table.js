exports.up = async (knex) => {
  await knex.schema.createTable('recipe', (tbl) => {
    tbl.increments('recipe_id');
    tbl.string('recipe_name').notNullable();
    tbl.string('ingredients', 500).notNullable();
    tbl.string('recipe_img', 500);
    tbl
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('user_id')
      .inTable('user')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    tbl.timestamps(false, true);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('recipe');
};
