const router = require('express').Router();
const { celebrate, errors } = require('celebrate');
const NotFoundError = require('../errors/NotFoundError');
const {
  getUsers,
  getUser,
  changeProfile,
  changeAvatar,
} = require('../controllers/users');
const {
  getCards,
  postCard,
  deleteCard,
  addLike,
  removeLike,
} = require('../controllers/cards');
const {
  validateGetUser,
  validateСhangeProfile,
  validateChangeAvatar,
  validatePostCard,
  validateDeleteCard,
  validateLike,
} = require('../middlewares/celebrateConfig');

router.get('/users', getUsers);
router.get('/users/:id', celebrate(validateGetUser), getUser);
router.patch('/users/me', celebrate(validateСhangeProfile), changeProfile);
router.patch('/users/me/avatar', celebrate(validateChangeAvatar), changeAvatar);

router.get('/cards', getCards);
router.post('/cards', celebrate(validatePostCard), postCard);
router.delete('/cards/:id', celebrate(validateDeleteCard), deleteCard);
router.put('/cards/:cardId/likes', celebrate(validateLike), addLike);
router.delete('/cards/:cardId/likes', celebrate(validateLike), removeLike);

router.use(errors());

router.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
