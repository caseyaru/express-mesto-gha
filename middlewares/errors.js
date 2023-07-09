const errorHandler = (req, res, next) => {
  res.status(500).send({ message: 'Произошла ошибка на сервере' })
  next();
}

module.exports = errorHandler;