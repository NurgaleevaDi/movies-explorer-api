const User = require('../models/users');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({data: users}))
    .catch(() => res.status(404).send({message: 'Error!'}))
};

module.exports.createUser = (req, res) => {
  const { email, password, name } = req.body;
  User.create({email, password, name})
    .then((user) => res.send({ user }))
    .catch(err => res.status(500).send({message: `Ошибка ${err}`}));
}