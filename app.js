const express = require('express');
const mongoose = require('mongoose');
const NotFoundError = require('./errors/not-found-error');
const bodyParser = require ('body-parser');
const { createUser, login } = require('./controllers/users');
const { errors, celebrate, Joi } = require('celebrate');
const { auth } = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

app.use('/users', auth, require('./routes/users'));
app.use('/movies', auth, require('./routes/movies'));

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.use(errors()); // обработчик ошибок celebrate

// централизованный обработчик ошибок
app.use('/*', auth, (req, res, next) => next(new NotFoundError('Запрашиваемая страница не существует')));


app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode)
  .send({message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})

