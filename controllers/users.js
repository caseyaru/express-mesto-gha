const mongoose = require('mongoose');

const User = require('../models/user');

const ERROR_CODE = 500;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;

const createUser = (req, res) => {
  const {name, about, avatar} = req.body;
  User.create({name, about, avatar})
  .then((user) => {
    res.send(user)
  })
  .catch((error) => {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      return;
    }
    else res.status(ERROR_CODE).send({ message: 'Произошла ошибка на сервере' })
  })
}

const getUsers = (req, res) => {
  User.find({})
  .then((users) => {
    res.send(users)
  })
  .catch((error) => {
    res.status(ERROR_CODE).send({ message: 'Произошла ошибка на сервере' })
  })
}

const getUser = (req, res) => {
  const {userId} = req.params;
  User.findById(userId)
  .then((user) => {
    if (!user) {
      res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      return;
    };
    res.send(user);
  })
  .catch((error) => {
    res.status(ERROR_CODE).send({ message: 'Произошла ошибка на сервере' })
  })
}

const updateUser = (req, res) => {
  const {name, about} = req.body;
  User.findByIdAndUpdate(req.user._id, {name, about}, { new: true, runValidators: true })
  .then((user) => {
    if (!user) {
      res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      return;
    };
    res.send(user)
  })
  .catch((error) => {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      return;
    }
    res.status(ERROR_CODE).send({ message: 'Произошла ошибка на сервере' })
  })
}

const updateUserAvatar = (req, res) => {
  const {avatar} = req.body;
  User.findByIdAndUpdate(req.user._id, {avatar}, { new: true, runValidators: true })
  .then((user) => {
    if (!user) {
      res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      return;
    };
    res.send(user)
  })
  .catch((error) => {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      return;
    }
    res.status(ERROR_CODE).send({ message: 'Произошла ошибка на сервере' })
  })
}

module.exports = {
  createUser, getUsers, getUser, updateUser, updateUserAvatar
}