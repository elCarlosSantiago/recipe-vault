exports.up = async (knex) => {
  await knex.schema.createTable('step', (tbl) => {
    tbl.increments('step_id');
    tbl.string('step_text', 500).notNullable();
    tbl.integer('step_order').notNullable().unsigned();
    tbl
      .integer('recipe_id')
      .unsigned()
      .references('recipe_id')
      .inTable('recipe')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('step');
};
