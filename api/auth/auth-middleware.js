const db = require('../data/dbConfig');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const { JWT_SECRET } = require('../secrets');
const { check, validationResult } = require('express-validator');

const registerPayloadDuplicate = async (req, res, next) => {
  const { username, email } = req.body;
  const userCheck = await db('user').where('username', username).first();
  const emailCheck = await db('user').where('email', email).first();

  if (!userCheck && !emailCheck) {
    next();
  } else if (userCheck) {
    return res.status(401).json({ message: 'username taken' });
  } else {
    return res.status(401).json({ message: 'email taken' });
  }
};

const registerSchema = [
  check('username', 'Username must be at least 4 characters')
    .isLength({ min: 4 })
    .trim()
    .escape(),
  check('password')
    .matches(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/
    )
    .withMessage(
      'Password must contain at least 8 characters, one uppercase, one number and one special case character'
    )
    .trim()
    .escape(),
  check('email', 'Invalid Email').isEmail().trim().escape(),
];

const registerValidate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json(errors.array());
  } else {
    next();
  }
};

module.exports = {
  registerSchema,
  registerValidate,
  registerPayloadDuplicate,
};
