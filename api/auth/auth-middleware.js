const db = require('../data/dbConfig');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('../secrets');
const { check, validationResult } = require('express-validator');

const registerPayloadDuplicate = async (req, res, next) => {
  const { username, email } = req.body;
  const userCheck = await db('users').where('username', username).first();
  const emailCheck = await db('users').where('email', email).first();

  if (!userCheck && !emailCheck) {
    next();
  } else if (userCheck) {
    return res.status(401).json({ message: 'username taken' });
  } else {
    return res.status(401).json({ message: 'email taken' });
  }
};

module.exports = {
  registerPayloadDuplicate,
};
