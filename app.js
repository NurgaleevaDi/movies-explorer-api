require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./helpers/rateLimiter');
const routes = require('./routes');
const errorsHandler = require('./middlewares/errorsHandler');

const { PORT = 3000, NODE_ENV, MONGO_URL } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());

mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : 'mongodb://localhost:27017/moviesdb');

app.use(requestLogger);

app.use(limiter);

app.use(routes);

app.use(errorLogger);

app.use(errors()); // обработчик ошибок celebrate

app.use(errorsHandler); // централизованный обработчик ошибок

app.listen(PORT, () => {
  // console.log(`App listening on port ${PORT}`);
});
