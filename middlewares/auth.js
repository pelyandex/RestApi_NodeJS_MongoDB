const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const cookie = req.cookies.jwt;
  let payload;
  try {
    if (!cookie) {
      throw cookie;
    }
    payload = jwt.verify(cookie, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new AuthError('Необходима авторизация'));
  }
  req.user = payload;
  next();
};
