class NotValidData extends Error {
  constructor(err) {
    super(err);
    this.statusCode = 400;
    this.message = 'Переданы некорректные данные';
  }
}

module.exports = NotValidData;
