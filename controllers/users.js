const User = require("../models/user");
const ERROR_VALID = 400;
const ERROR_NOTFOUND = 404;
const ERROR_DEF = 500;
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(ERROR_VALID)
          .send({ message: "Переданы некорректные данные" });
      } else {
        res.status(ERROR_DEF).send({ message: "Произошла ошибка" });
      }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      res.status(ERROR_DEF).send({ message: "Произошла ошибка" });
    });
};
module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user == null) {
        res
          .status(ERROR_NOTFOUND)
          .send({ message: "Передан невалидный ID пользователя" });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(ERROR_NOTFOUND)
          .send({ message: "Передан невалидный ID пользователя" });
      } else {
        res.status(ERROR_DEF).send({ message: "Произошла ошибка" });
      }
    });
};
module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (user == null) {
        res.status(ERROR_NOTFOUND).send({ message: "Пользователь не найден" });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(ERROR_VALID)
          .send({ message: "Переданы некорректные данные" });
      } else if (err.name === "CastError") {
        res
          .status(ERROR_NOTFOUND)
          .send({ message: "Передан невалидный ID пользователя" });
      } else {
        res.status(ERROR_DEF).send({ err });
      }
    });
};
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (user == null) {
        res.status(ERROR_NOTFOUND).send({ message: "Пользователь не найден" });
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(ERROR_VALID)
          .send({ message: "Переданы некорректные данные" });
      } else if (err.name === "CastError") {
        res
          .status(ERROR_NOTFOUND)
          .send({ message: "Передан невалидный ID пользователя" });
      } else {
        res.status(ERROR_DEF).send({ message: "Произошла ошибка" });
      }
    });
};
