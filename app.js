const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const cookieParser = require('cookie-parser');

const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');

const app = express();
const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const usersRoute = require('./routes/users');
const cardsRoute = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { errorHandler } = require('./middlewares/errors');
const NotFound = require('./errors/NotFound');

const regex = /^https?:\/\/.+\.[a-z]+/;

mongoose.connect(DB_URL);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());
app.disable('x-powered-by');

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().uri({ scheme: ['http', 'https'] }).pattern(regex),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser,
);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    }),
  }),
  login,
);

app.use(auth);

app.use('/users', usersRoute);
app.use('/cards', cardsRoute);

app.use('*', (req, res, next) => {
  next(new NotFound('Маршрут не найден'));
});

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Сервер жив');
});
