const router = require('express').Router();
const { validateMovieBody, validateDeleteMovie } = require('../helpers/validators');
const {
  getMovies,
  createMovie,
  deleteMovie
} = require('../controllers/movies');

router.get('', getMovies);
router.post('', validateMovieBody, createMovie);
router.delete('/:_id', validateDeleteMovie, deleteMovie);

module.exports = router;