const router = require('express').Router();
const { uniqueRecipeUserPermissions } = require('./recipe-middleware');
const Recipes = require('./recipe-model');

router.get('/', async (req, res, next) => {
  const decodedUserId = req.decodedJwt.user_id;
  try {
    const allRecipes = await Recipes.findAll(decodedUserId);
    res.json(allRecipes);
  } catch (err) {
    next(err);
  }
});

router.get('/:recipe_id', uniqueRecipeUserPermissions, async (req, res, next) => {
  const decodedUserId = req.decodedJwt.user_id;
  const recipe_id = parseInt(req.params.recipe_id);
  try {
    const recipe = await Recipes.findById(decodedUserId, recipe_id);
    res.json(recipe);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
