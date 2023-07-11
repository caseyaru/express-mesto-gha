class UserError extends Error {
  constructor(err) {
    super(err);
    this.statusCode = 409;
    this.message = 'Данный email уже зарегистрирован';
  }
}

module.exports = UserError;
