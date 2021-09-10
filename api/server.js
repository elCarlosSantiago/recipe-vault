const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./secrets');
const authRouter = require('./auth/auth-router');
const recipeRouter = require('./recipe/recipe-router');
const { restricted } = require('./auth/auth-middleware');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

if (NODE_ENV === 'development') {
  const morgan = require('morgan');
  server.use(morgan('dev'));
}

server.use('/api/auth', authRouter);
server.use('/api/recipes', restricted, recipeRouter);

server.use('/', (req, res) => {
  res.json({ api: 'up' });
});

//eslint-disable-next-line
server.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
