const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const createUser = (req, res, next) => {
  bcrypt.hash(String(req.body.password), 10)
  .then(hashedPassword => {
    User.create({...req.body, password: hashedPassword})
    .then((user) => {
      res.status(201).send({
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      })
    })
    .catch(next);
  })
  .catch(next);
}

const login = (req, res, next) => {
  const {email, password} = req.body;
  if (!email || !password) {
    return res.status(401).send({ message: 'Переданы не все необходимые данные' });
  }
  User.findOne({email})
      .select('+password')
      .orFail(() => new Error('Пользователь не найден'))
      .then((user) => {
        bcrypt.compare(password, user.password)
              .then(isValidUser => {
                if (isValidUser) {
                  const token = jwt.sign({ _id: user.id }, 'secret', { expiresIn: '7d' });
                  res.cookie('jwt', token, {
                    maxAge: 3600 * 24 * 7,
                    httpOnly: true
                  })
                  res.status(200).send(user);
                } else {
                  res.status(401).send({ message: 'Неверный пароль' });
                }
              })
              .catch(next);
      })
      .catch(next);
}

const getUsers = (req, res, next) => {
  User.find({})
  .then((users) => {
    res.status(200).send(users);
  })
  .catch(next);
}

const getUser = (req, res, next) => {
  const {userId} = req.params;
  User.findById(userId)
  .orFail(new Error('notValidData'))
  .then((user) => {
    res.status(200).send(user);
  })
  .catch(next);
}

const getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const {name, about} = req.body;
  User.findByIdAndUpdate(req.user._id, {name, about}, { new: true, runValidators: true })
  .orFail(new Error('notValidData'))
  .then((user) => {
    res.status(200).send(user);
  })
  .catch(next)
}

const updateUserAvatar = (req, res, next) => {
  const {avatar} = req.body;
  User.findByIdAndUpdate(req.user._id, {avatar}, { new: true, runValidators: true })
  .orFail(new Error('notValidData'))
  .then((user) => {
    res.status(200).send(user);
  })
  .catch(next)
}

module.exports = {
  createUser, getUsers, getUser, getMe, updateUser, updateUserAvatar, login
}