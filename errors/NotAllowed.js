class NotAllowed extends Error {
  constructor(err) {
    super(err);
    this.statusCode = 403;
    this.message = 'Недостаточно прав';
  }
}

module.exports = NotAllowed;
