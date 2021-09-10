exports.seed = async (knex) => {
  await knex('step').insert([
    {
      step_text: 'Heat pan on medium heat until water droplets glide',
      recipe_id: 1,
      step_order: 1,
    },
    {
      step_text: 'Melt butter, dont brown.',
      recipe_id: 1,
      step_order: 2,
    },
    {
      step_text: 'Fold eggs over until desired consistency',
      recipe_id: 1,
      step_order: 3,
    },
    {
      step_text: 'Season with Salt and Pepper to taste',
      recipe_id: 1,
      step_order: 4,
    },
    {
      step_text: 'lightly toast bread',
      recipe_id: 2,
      step_order: 1,
    },
    {
      step_text: 'spread peanut butter',
      recipe_id: 2,
      step_order: 2,
    },
    {
      step_text: 'spread jelly and put two sides together',
      recipe_id: 2,
      step_order: 3,
    },
  ]);
};
