class NotFound extends Error {
  constructor(err) {
    super(err);
    this.statusCode = 404;
    this.message = 'Данные не найдены';
  }
}

module.exports = NotFound;
