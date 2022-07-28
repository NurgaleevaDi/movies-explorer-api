const router = require('express').Router();

const {
  getUsers,
  getUser,
  updateUser
} = require('../controllers/users');

router.get('', getUsers); // роут для тестирования, надо убрать
router.get('/me', getUser);
router.patch('/me', updateUser);

module.exports = router;