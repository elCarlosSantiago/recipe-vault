const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Users = require('./auth-model');

router.post('/register', async (req, res, next) => {
  try {
    res.status(201).json({ message: 'Testing out this register router' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
