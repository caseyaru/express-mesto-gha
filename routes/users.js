const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {getUsers, getUser, getMe, updateUser, updateUserAvatar} = require('../controllers/users');

router.get('/me',getMe);

router.get('/', getUsers);

router.get('/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().hex().required(),
    }),
  }),
  getUser
);

router.patch('/me',
  // celebrate({
  //   body: Joi.object().keys({
  //     name: Joi.string().min(2).max(30),
  //     about: Joi.string().min(2).max(30),
  //   }),
  // }),
  updateUser
);

router.patch('/me/avatar',
  // celebrate({
  //   body: Joi.object().keys({
  //     avatar: Joi.string().uri({scheme: ['http', 'https']}).messages({'string.uri': 'Некорректная ссылка на аватар'}),
  //   }),
  // }),
  updateUserAvatar
);

module.exports = router;