const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require ('body-parser');
const { createUser, login } = require('./controllers/users');
const { auth } = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

app.use('/users', auth, require('./routes/users'));

app.post(
  '/signup',
  createUser,
);

app.post(
  '/signin',
  login,
);


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})

