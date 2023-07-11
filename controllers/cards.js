const Card = require('../models/card');

const createCard = (req, res, next) => {
  const {name, link} = req.body;
  Card.create({name, link, owner: req.user._id})
  .then((card) => {
    res.status(201).send(card)
  })
  .catch(next);
}

const getCards = (req, res, next) => {
  Card.find({})
  .then((cards) => {
    res.status(200).send(cards)
  })
  .catch(next);
}

const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
  .then((card) => {
    if (card.owner.toString() === req.user._id) {
      card.deleteOne(card)
      .then((cards) => {
        res.status(200).send(cards);
      })
      .catch(next);
    } else {
      return res.status(403).send({message: 'Недостаточно прав для удаления карточки'})
    }
  })
  .catch(next);
}

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
  .orFail(new Error('notValidData'))
  .then((card) => {
    res.status(200).send(card)
  })
  .catch(next);
}

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
  .orFail(new Error('notValidData'))
  .then((card) => {
    res.status(200).send(card)
  })
  .catch(next);
}

module.exports = {
  createCard, getCards, deleteCard, likeCard, dislikeCard
}