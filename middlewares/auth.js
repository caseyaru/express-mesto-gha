const jwt = require('jsonwebtoken');
const {NotAllData} = require('../middlewares/errors');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'secret');
  } catch(err) {
    next(new NotAllData('Ошибка в токене'));
    //res.status(401).send({ message: 'Ошибка в токене' })
  }

  req.user = payload;

  next();
}

module.exports = auth;