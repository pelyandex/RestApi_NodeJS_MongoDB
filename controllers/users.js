const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const escape = require('escape-html');
const user = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res, next) => {
  user.find({})
    .then((findUsers) => res.send({ data: findUsers }))
    .catch(next);
};

const getUser = (req, res, next) => {
  const id = escape(req.params.id);
  user.find({ _id: id })
    .then((findUser) => {
      if (findUser.length) {
        res.send({ data: findUser });
      } else {
        throw new NotFoundError('Пользователь с таким Id не найден');
      }
    })
    .catch((err) => {
      next(err);
    });
};

const createUser = (req, res, next) => {
  const name = escape(req.body.name);
  const about = escape(req.body.about);
  const avatar = escape(req.body.avatar);
  const email = escape(req.body.email);
  if (req.body.password) {
    bcrypt.hash(escape(req.body.password), 10)
      .then((password) => user.create({
        name, about, avatar, email, password,
      }))
      .then((createdUser) => {
        const profile = createdUser;
        delete profile._doc.password;
        res.send({ data: profile });
      })
      .catch((err) => {
        if (err.name === 'ValidationError' || err.code === 11000) {
          next(new ValidationError('Ошибка валидации'));
        } else {
          next(err);
        }
      });
  } else {
    next(new ValidationError('Ошибка валидации'));
  }
};

const changeProfile = (req, res, next) => {
  const name = escape(req.body.name);
  const about = escape(req.body.about);
  const id = req.user._id;
  user.findByIdAndUpdate(
    id,
    { name, about },
    { new: true, runValidators: true, upsert: true },
  )
    .then((updatedUser) => {
      res.send({ data: updatedUser });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Ошибка валидации'));
      } else {
        next(err);
      }
    });
};

const changeAvatar = (req, res, next) => {
  const avatar = escape(req.body.avatar);
  const id = req.user._id;
  user.findByIdAndUpdate(
    id,
    { avatar },
    { new: true, runValidators: true, upsert: true },
  )
    .then((updatedUser) => {
      res.send({ data: updatedUser });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Ошибка валидации'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const email = escape(req.body.email);
  const password = escape(req.body.password);
  return user.findUserByCredentials(email, password)
    .then((usery) => {
      const token = jwt.sign(
        { _id: usery._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .end();
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  changeProfile,
  changeAvatar,
  login,
};
