const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { BCRYPT_ROUNDS } = require('../secrets');
const {
  registerSchema,
  registerValidate,
  registerPayloadDuplicate,
} = require('./auth-middleware');
const Users = require('./auth-model');

router.post(
  '/register',
  registerSchema,
  registerValidate,
  registerPayloadDuplicate,
  async (req, res, next) => {
    try {
      let user = req.body;
      const hash = bcrypt.hashSync(user.password, BCRYPT_ROUNDS);
      user.password = hash;
      const newUser = await Users.addUser(user);
      res.status(201).json(newUser);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
