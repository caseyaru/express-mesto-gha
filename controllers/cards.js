const mongoose = require('mongoose');

const ERROR_CODE = 500;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;

const Card = require('../models/card');

const createCard = (req, res) => {
  const {name, link} = req.body;
  Card.create({name, link, owner: req.user._id})
  .then((card) => {
    res.send(card)
  })
  .catch((error) => {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      return;
    }
    else res.status(ERROR_CODE).send({ message: 'Произошла ошибка на сервере' })
  })
}

const getCards = (req, res) => {
  Card.find({})
  .then((cards) => {
    res.send(cards)
  })
  .catch((error) => {
    res.status(ERROR_CODE).send({ message: 'Произошла ошибка на сервере' })
  })
}

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
  .then((card) => {
    if (!card) {
      res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' })
      return;
    }
    res.send(card)
  })
  .catch((error) => {
    if (error instanceof mongoose.Error.CastError) {
      res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      return;
    }
    res.status(ERROR_CODE).send({ message: 'Произошла ошибка на сервере' })
  })
}

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
  .then((card) => {
    if (!card) {
      res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      return;
    }
    res.send(card)
  })
  .catch((error) => {
    if (error instanceof mongoose.Error.CastError) {
      res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка' });
      return;
    }
    res.status(ERROR_CODE).send({ message: 'Произошла ошибка на сервере' })
  })
}

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
  .then((card) => {
    if (!card) {res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' })}
    res.send(card)
  })
  .catch((error) => {
    if (error instanceof mongoose.Error.CastError) {
      res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятии лайка' });
      return;
    }
    res.status(ERROR_CODE).send({ message: 'Произошла ошибка на сервере' })
  })
}

module.exports = {
  createCard, getCards, deleteCard, likeCard, dislikeCard
}