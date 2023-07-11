const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');

const app = express();

const usersRoute = require('./routes/users');
const cardsRoute = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errors');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());
app.disable('x-powered-by');

app.post('/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().uri({scheme: ['http', 'https']}),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser
);

app.post('/signin', login);

app.use(auth);

app.use('/users', usersRoute);
app.use('/cards', cardsRoute);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Указан неверный маршрут' });
});

app.use(errors());
app.use(errorHandler);

app.listen(3000, () => {
  console.log('Сервер жив')
})