const NotFound = require('../errors/NotFound');
const NotValidData = require('../errors/NotValidData');
const NotAllData = require('../errors/NotAllData');
const NotAllowed = require('../errors/NotAllowed');
const UserError = require('../errors/UserError');
const ServerError = require('../errors/ServerError');

const errorHandler = (err, req, res, next) => {
  console.log(err);

  let error;

  if (err.statusCode === 404) {
    error = new NotFound(err);
  } else if (err.statusCode === 400) {
    error = new NotValidData(err);
  } else if (err.statusCode === 401) {
    error = new NotAllData(err);
  } else if (err.statusCode === 403) {
    error = new NotAllowed(err);
  } else if (err.code === 11000) {
    error = new UserError(err);
  } else {
    error = new ServerError(err);
  }

  res.status(error.statusCode).send({ message: error.message });

  next();
};

module.exports = { errorHandler };
