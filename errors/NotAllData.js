class NotAllData extends Error {
  constructor(err) {
    super(err);
    this.statusCode = 401;
    this.message = 'Введены не все необходимые данные';
  }
}

module.exports = NotAllData;
