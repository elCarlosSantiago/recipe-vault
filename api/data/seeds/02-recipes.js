exports.seed = async (knex) => {
  await knex('recipe').insert([
    {
      recipe_name: 'test-recipe',
      ingredients: '2 eggs, salt, pepper, butter',
      user_id: 1,
    },
  ]);
};
