const Card = require("../models/card");

module.exports.findCard = (req, res) => {
  Card.find({})
    .populate(["owner", "likes"])
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: "Произошла ошибка" }));
};
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user._id,
    likes: [],
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(400)
          .send({ message: "Переданы некорректные данные карточки" });
      } else {
        res.status(500).send({ err });
      }
    });
};
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (req.params.cardId.length != 25) {
        res.status(400).send({ message: "Не правильный ID" });
      } else if (err.name === "CastError") {
        res.status(404).send({ message: "Карточка не найдена" });
      } else {
        res.status(500).send({ message: "Произошла ошибка" });
      }
    });
};
module.exports.putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (card == null) {
        res.status(404).send({ message: "карточка не найдена" });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send({ message: "Пользователь не найден" });
      } else {
        res.status(500).send({ err });
      }
    });
};
module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (card == null) {
        res.status(404).send({ message: "карточка не найдена" });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send({ message: "Пользователь не найден" });
      } else {
        res.status(500).send({ err });
      }
    });
};
