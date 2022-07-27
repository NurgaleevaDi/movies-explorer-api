const mongoose = require('mongoose');
const { validateLink } = require('../helpers/validateLink');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validateLink.test(v),
      message: 'Неправильный формат ссылки',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validateLink.test(v),
      message: 'Неправильный формат ссылки',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validateLink.test(v),
      message: 'Неправильный формат ссылки',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Необходим id'],
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId, // Проверить!
    ref: 'user',
    required: [true, 'Необходим id'],
  },
  nameRU: {
    type: Number,
    required: true,
  },
  nameEN: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);