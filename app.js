const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

const usersRoute = require('./routes/users');
const cardsRoute = require('./routes/cards');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = { _id: '64a076597568596f72fcdbe4' };
  next();
});

app.use('/users', usersRoute);
app.use('/cards', cardsRoute);

app.listen(3000, () => {
  console.log('Сервер жив')
})