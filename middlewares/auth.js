const jwt = require('jsonwebtoken');

const NotAllData = require('../errors/NotAllData');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'secret');
  } catch (err) {
    next(new NotAllData('Ошибка в токене'));
  }

  req.user = payload;

  next();
};

module.exports = auth;
