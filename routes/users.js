const router = require('express').Router();
const { validateUpdateUser } = require('../helpers/validators');

const {
  getUsers,
  getUser,
  updateUser
} = require('../controllers/users');

router.get('', getUsers); // роут для тестирования, надо убрать
router.get('/me', getUser); // надо ли делать валидацию
router.patch('/me', validateUpdateUser, updateUser);

module.exports = router;