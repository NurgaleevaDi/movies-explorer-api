const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const { auth } = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const { validateUserBody, validateAuthentication } = require('../helpers/validators');
const NotFoundError = require('../errors/not-found-error');

router.post('/signup', validateUserBody, createUser);
router.post('/signin', validateAuthentication, login);
router.use('/users', auth, userRouter);
router.use('/movies', auth, movieRouter);
router.use('/*', auth, (req, res, next) => next(new NotFoundError('Запрашиваемая страница не существует')));

module.exports = router;