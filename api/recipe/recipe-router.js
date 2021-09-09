const router = require('express').Router();
const Recipes = require('./recipe-model');

router.get('/', async (req, res, next) => {
  const decodedUserId = 1;
  try {
    const allRecipes = await Recipes.findAll(decodedUserId);
    res.json(allRecipes);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
