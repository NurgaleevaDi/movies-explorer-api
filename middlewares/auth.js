const { checkToken } = require('../helpers/jwt');
const { ERROR_UNAUTHORIZED } = require('../helpers/errors');

const throwUnathorizedError = () => {
  const error = new Error('Авторизуйтесь');
  error.statusCode = ERROR_UNAUTHORIZED;
  throw error;
};
const auth = (req, res, next) => {
  const isAutorized = req.headers.authorization;
  if (!isAutorized) {
    throwUnathorizedError();
  }
  const token = isAutorized.replace('Bearer ', '');
  let payload;
  try {
    payload = checkToken(token);
  } catch (err) {
    throwUnathorizedError();
  }
  req.user = payload;
  return next();
};

module.exports = { auth };
