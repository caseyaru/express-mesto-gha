const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');

const {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30)
        .messages({
          'string.min': 'Минимальная длина названия - 2 символа',
          'string.max': 'Максимальная длина названия - 30 символов',
        }),
      link: Joi.string().required().uri({ scheme: ['http', 'https'] }).messages({
        'string.uri': 'Некорректная ссылка на изображение',
      }),
    }),
  }),
  createCard,
);

router.get('/', getCards);

router.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),
  deleteCard,
);

router.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),
  likeCard,
);

router.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),
  dislikeCard,
);

router.use(errors());

module.exports = router;
