const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUser,
  updateUser
} = require('../controllers/users');

router.get('', getUsers); // роут для тестирования, надо убрать
router.get('/me', getUser); // надо ли делать валидацию celebrate?
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUser
);

module.exports = router;