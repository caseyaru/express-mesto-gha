const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');

const regex = /^https?:\/\/.+\.[a-z]+/;

const {
  getUsers, getUser, getMe, updateUser, updateUserAvatar,
} = require('../controllers/users');

router.get('/me', getMe);

router.get('/', getUsers);

router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().hex().length(24).required(),
    }),
  }),
  getUser,
);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).messages({
        'string.min': 'Минимальная длина имени - 2 символа',
        'string.max': 'Максимальная длина имени - 30 символов',
      }),
      about: Joi.string().min(2).max(30).messages({
        'string.min': 'Минимальная длина информации о себе - 2 символа',
        'string.max': 'Максимальная длина информации о себе - 30 символов',
      }),
    }),
  }),
  updateUser,
);

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().uri({ scheme: ['http', 'https'] }).pattern(regex),
    }),
  }),
  updateUserAvatar,
);

router.use(errors());

module.exports = router;
