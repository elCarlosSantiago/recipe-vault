const db = require('../data/dbConfig');

const findAll = async (user_id) => {
  const allRecipes = await db('recipe').where('user_id', user_id);
  return allRecipes;
};

module.exports = {
  findAll,
};
