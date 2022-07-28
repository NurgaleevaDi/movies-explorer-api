const bcrypt = require('bcrypt');
const User = require('../models/users');

const Unauthorized = require('../errors/unauthorized');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');
const NotFoundError = require('../errors/not-found-error');

const { generateToken } = require('../helpers/jwt');
const { MONGO_DUPLICATE_ERROR } = require('../helpers/errors');
const SALT_ROUNDS = 10;


// getUsers для тестирования, надо убрать в финале
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({data: users}))
    .catch(() => res.status(404).send({message: 'Error!'}))
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Не передан email или password');
  }
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
        next(new BadRequestError('Ошибка ввода данных'));
      } else if (err.code === MONGO_DUPLICATE_ERROR) {
        next(new ConflictError('Email уже используется'));
        return;
      }
      next(err);
    });
}

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Unauthorized('Не передан email или password');
  }
  User
    .findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new Unauthorized('Не передан email или password');
      }
      return Promise.all([
        user,
        bcrypt.compare(password, user.password),
      ]);
    })
    .then(([user, isPasswordCorrect]) => {
      if (!isPasswordCorrect) {
        throw new Unauthorized('Не передан email или password');
      }
      return generateToken({ _id: user._id });
    })
    .then((token) => {
      res.send({ token });
    })
    .catch(next);
}

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch(next);
}

module.exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name }, // add somthing else?
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
        return;
      }
      next(err);
    });
};