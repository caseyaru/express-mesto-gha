const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const app = express();

const usersRoute = require('./routes/users');
const cardsRoute = require('./routes/cards');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());
app.use(helmet());
app.disable('x-powered-by');

app.use((req, res, next) => {
  req.user = { _id: '64a076597568596f72fcdbe4' };
  next();
});

app.use('/users', usersRoute);
app.use('/cards', cardsRoute);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Указан неверный маршрут' });
});

app.listen(3000, () => {
  console.log('Сервер жив')
})