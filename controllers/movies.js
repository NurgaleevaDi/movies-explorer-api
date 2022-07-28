const Movie = require('../models/movies');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;
  // const movieId
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
    owner
  })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      console.log('err', err);
      if(err.name === 'ValidationError') {
        next(new BadRequestError(`Ошибка валидации: ${err}`));
        return;
      }
      next(err);
    })
}

module.exports.getMovies = (req, res, next) => {
  console.log(res);
  Movie.find({})
    .then((movies) => res.send({ data: movies }))
    .catch(next);
}

module.exports.deleteMovie = (req, res, next) => {
  console.log('req.params', req.params);
  Movie.findById(req.params._id)
    .then((movie) => {
      if(!movie) {
        throw new NotFoundError('Фильм не найден');
      } else if (String(movie.owner) !== String(req.user._id)) {
        throw new ForbiddenError('Нельзя удалять чужой фильм');
      } else {
        movie.remove()
          .then(() => res.send({ movie }));
      }
    })
    .catch((err) => next(err));
}