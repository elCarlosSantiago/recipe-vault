const db = require('../data/dbConfig');

const uniqueRecipeUserPermissions = async (req, res, next) => {
  const recipe_id = parseInt(req.params.recipe_id);
  const decodedUserId = req.decodedJwt.user_id;

  const [recipe] = await db('recipe')
    .where({ recipe_id })
    .where('user_id', decodedUserId);

  if (!recipe) {
    return res.status(401).json({ message: 'This resource does not exist for user' });
  } else {
    next();
  }
};

module.exports = {
  uniqueRecipeUserPermissions,
};
