const { Joi } = require('celebrate');

module.exports.validateSignUp = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
};

module.exports.validateSignIn = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
};

module.exports.validateGetUser = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

module.exports.validateСhangeProfile = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
};

module.exports.validateChangeAvatar = {
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
};

module.exports.validatePostCard = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
};

module.exports.validateDeleteCard = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

module.exports.validateLike = {
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
};
