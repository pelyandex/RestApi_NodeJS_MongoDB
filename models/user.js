const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const ValidationError = require('../errors/ValidationError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function f(email, password) {
  return this.findOne({ email }).select('+password')
    .then((usery) => {
      if (!usery) {
        return Promise.reject(new ValidationError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, usery.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new ValidationError('Неправильные почта или пароль'));
          }
          return usery;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
