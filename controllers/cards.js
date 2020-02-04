const escape = require('escape-html');
const card = require('../models/card');
const ValidationError = require('../errors/ValidationError');

const getCards = (req, res, next) => {
  card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

const postCard = (req, res, next) => {
  const owner = req.user._id;
  const name = escape(req.body.name);
  const link = escape(req.body.link);
  card.create({ name, link, owner })
    .then((cardy) => {
      res.send({ data: cardy });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Ошибка валидации'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const id = escape(req.params.id);
  card.findOneAndRemove(
    {
      _id: id,
      owner: req.user._id,
    },
  )
    .then((cardy) => {
      if (cardy) {
        res.send({ data: cardy });
      } else {
        throw new ValidationError('Ошибка валидации');
      }
    })
    .catch(next);
};

const addLike = (req, res, next) => {
  const cardId = escape(req.params.cardId);
  card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((cardy) => {
      res.send({ data: cardy });
    })
    .catch(next);
};
const removeLike = (req, res, next) => {
  const cardId = escape(req.params.cardId);
  card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((cardy) => {
      res.send({ data: cardy });
    })
    .catch(next);
};

module.exports = {
  getCards,
  postCard,
  deleteCard,
  addLike,
  removeLike,
};
