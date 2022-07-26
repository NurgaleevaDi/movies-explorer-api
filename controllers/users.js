const bcrypt = require('bcrypt');
const User = require('../models/users');

const Unauthorized = require('../errors/unauthorized');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');
const NotFoundError = require('../errors/not-found-error');

const { generateToken } = require('../helpers/jwt');
const { MONGO_DUPLICATE_ERROR } = require('../helpers/errors');

const SALT_ROUNDS = 10;

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  // if (!email || !password) {
  //   throw new BadRequestError('Не передан email или password');
  // }
  bcrypt
    .hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => {
      res.send({
        name: user.name,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('При регистрации пользователя произошла ошибка.'));
      } else if (err.code === MONGO_DUPLICATE_ERROR) {
        next(new ConflictError('Пользователь с таким email уже существует.'));
        return;
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  // if (!email || !password) {
  //   throw new Unauthorized('Не передан email или password');
  // }
  User
    .findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new Unauthorized('Вы ввели неправильный логин или пароль');
      }
      return Promise.all([
        user,
        bcrypt.compare(password, user.password),
      ]);
    })
    .then(([user, isPasswordCorrect]) => {
      if (!isPasswordCorrect) {
        throw new Unauthorized('Вы ввели неправильный логин или пароль');
      }
      return generateToken({ _id: user._id });
    })
    .then((token) => {
      res.send({ token });
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, email: req.body.email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные'));
      } else if (err.code === MONGO_DUPLICATE_ERROR) {
        next(new ConflictError('Пользователь с таким email уже существует.'));
        return;
      }
      next(err);
    });
};
