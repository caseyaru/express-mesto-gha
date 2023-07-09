const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const ERROR_CODE = 500;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;

const createUser = (req, res) => {
  // User.findOne({ email })
  // .then((user) => {
  //   if (user) {
  //     return res.status(403).send({ message: 'Пользователь уже есть в базе' });
  //   }
  // })
  //const {name, about, avatar, email, password} = req.body;
  return bcrypt.hash(String(req.body.password), 10)
  .then(hashedPassword => {
    User.create({...req.body, password: hashedPassword})
    .then((user) => {
      res.status(201).send(user)
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
       res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
       return;
      }
      else res.status(ERROR_CODE).send({ message: 'Произошла ошибка на сервере' })
    })
  })
  .catch(err => res.status(ERROR_CODE).send({ message: 'Произошла ошибка на сервере' }))
}

const login = (req, res, next) => {
  const {email, password} = req.body;

  if (!email || !password) {
    return res.status(401).send({ message: 'Переданы не все необходимые данные' })
  }

  User.findOne({email})
      .select('+password')
      .orFail(new Error('notValidData'))
      .then((user) => {
        bcrypt.compare(password, user.password)
              .then(isValidUser => {

                if (isValidUser) {
                  //тут будет создание джвт
                  const token = jwt.sign({ _id: user.id }, 'secret', { expiresIn: '7d' })
                  res.cookie('jwt', token, {
                    maxAge: 3600 * 24 * 7,
                    httpOnly: true
                  }) //ЗАКОНЧИЛА ЗДЕСЬ, ВИДЕО 1:22:45

                  res.status(201).send(user)
                } else {
                  res.status(401).send({ message: 'Передан неверный пароль' })
                }
              })
              .catch(err => res.status(ERROR_CODE).send({ message: 'Произошла ошибка на сервере' }))
      })
      .catch(err => res.status(ERROR_CODE).send({ message: 'Произошла ошибка на сервере' }))
}

const getUsers = (req, res) => {
  User.find({})
  .then((users) => {
    res.status(200).send(users)
  })
  .catch((error) => {
    res.status(ERROR_CODE).send({ message: 'Произошла ошибка на сервере' })
  })
}

const getUser = (req, res) => {
  const {userId} = req.params;
  User.findById(userId)
  .orFail(new Error('notValidData'))
  .then((user) => {
    res.status(200).send(user);
  })
  .catch((error) => {
    if (error.message === 'notValidData') {
      res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      return;
    };
    if (error instanceof mongoose.Error.CastError) {
      res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      return;
    }
    res.status(ERROR_CODE).send({ message: 'Произошла ошибка на сервере' })
  })
}

const updateUser = (req, res) => {
  const {name, about} = req.body;
  User.findByIdAndUpdate(req.user._id, {name, about}, { new: true, runValidators: true })
  .orFail(new Error('notValidData'))
  .then((user) => {
    res.status(200).send(user)
  })
  .catch((error) => {
    if (error.message === 'notValidData') {
      res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      return;
    };
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
  .orFail(new Error('notValidData'))
  .then((user) => {
    res.status(200).send(user)
  })
  .catch((error) => {
    if (error.message === 'notValidData') {
      res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      return;
    };
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      return;
    }
    res.status(ERROR_CODE).send({ message: 'Произошла ошибка на сервере' })
  })
}

module.exports = {
  createUser, getUsers, getUser, updateUser, updateUserAvatar, login
}

//раньше внутри createUer:
// const {name, about, avatar} = req.body;
//   User.create({name, about, avatar})
//   .then((user) => {
//     res.status(201).send(user)
//   })
//   .catch((error) => {
//     if (error instanceof mongoose.Error.ValidationError) {
//       res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
//       return;
//     }
//     else res.status(ERROR_CODE).send({ message: 'Произошла ошибка на сервере' })
//   })