export default class ServerError extends Error {
  constructor(err) {
    super(err);
    this.statusCode = 500;
    this.message = 'Произошла ошибка на сервере';
  }
}
