const router = require('express').Router();

router.get('/', async (req, res, next) => {
  try {
    res.status(200).json({ message: 'success' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
