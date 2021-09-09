const router = require('express').Router();
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

module.exports = router;
