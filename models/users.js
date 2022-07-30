const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    require: true,
    select: false,
  },
  name: {
    type: String,
    required: [true, 'Необходимо ввести имя'], // было закоментировано
    minlength: [2, 'Должно быть не менее 2 символов'],
    maxlength: [30, 'Должно быть не более 30 символов'],
    // default: '',
  },
});

module.exports = mongoose.model('user', userSchema);
