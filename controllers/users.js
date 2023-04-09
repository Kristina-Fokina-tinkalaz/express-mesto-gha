const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const NotValidError = require('../errors/not-valid-err');
// const AuthorizationError = require('../errors/authorization-err');

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  const digitRegExp = /^https?:\/\/[\w.\-_~:/?#[\]@!$&'()*+,;=]*/g;
  if (!validator.isEmail(email)) {
    throw new NotValidError('Некорректный email по данным validator.js');
  } else if (!avatar.match(digitRegExp)) {
    throw new NotValidError('В поле для аватара должна быть передана ссылка');
  } else {
    bcrypt.hash(password, 10)
      .then((hash) => User.create({
        name, about, avatar, email, password: hash,
      }).then((user) => {
        res.send({
          data: {
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
            _id: user._id,
          },
        });
      }).catch(next));
  }
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      const result = [];
      users.forEach((user) => {
        result.push({
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        });
      });
      res.send(result);
    })
    .catch(next);
};
module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send({
      data: {
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      },
    }))
    .catch(next);
};
module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user == null) {
        throw new NotFoundError('Передан невалидный ID пользователя');
      } else {
        res.send({
          data: {
            _id: user._id,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
          },
        });
      }
    })
    .catch(next);
};
module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user == null) {
        throw new NotFoundError('Пользователь не найден');
      } else {
        res.send({
          data: {
            _id: user._id,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
          },
        });
      }
    })
    .catch(next);
};
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      const digitRegExp = /^https?:\/\/(www.)?[\w.\-_~:/?#[\]@!$&'()*+,;=]*/g;
      if (!user.avatar.match(digitRegExp)) {
        throw new NotValidError('В поле для аватара должна быть передана ссылка');
      } else if (user == null) {
        throw new NotFoundError('Пользователь не найден');
      } else {
        res.send({
          data: {
            _id: user._id,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
          },
        });
      }
    })
    .catch(next);
};
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({ token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' }) });
    })
    .catch(next);
};
