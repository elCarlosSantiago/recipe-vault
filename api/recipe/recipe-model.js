const db = require('../data/dbConfig');

const findAllRecipes = async (user_id) => {
  const allRecipes = await db('recipes').where('user_id', 1);
  return allRecipes;
};

module.exports = {
  findAllRecipes,
};
