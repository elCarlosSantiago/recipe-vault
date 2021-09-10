const db = require('../data/dbConfig');

const findAll = async (user_id) => {
  const allRecipes = await db('recipe').where('user_id', user_id);
  return allRecipes;
};

const findById = async (user_id, recipe_id) => {
  const [recipe] = await db
    .select('recipe_id', 'recipe_name', 'ingredients')
    .from('recipe')
    .where({ user_id })
    .where({ recipe_id });

  const steps = await db
    .select('step_id', 'step_text', 'step_order')
    .from('step')
    .where({ recipe_id })
    .orderBy('step_order');

  recipe['steps'] = steps;

  const splitIngredients = recipe.ingredients.split(',');

  recipe.ingredients = splitIngredients.map((ingredient) => {
    return ingredient.trim();
  });
  return recipe;
};

module.exports = {
  findAll,
  findById,
};
