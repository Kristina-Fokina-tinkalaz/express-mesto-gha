const Card = require("../models/card");

module.exports.findCard = (req, res) => {
  Card.find({})
    .populate(["owner", "likes"])
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(400).send({}));
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
      if (card == null) {
        res
          .status(404)
          .send({ message: `Kарточкa id:${req.params.cardId} не найденa` });
      } else {
        res.send(`Карта удалена: ${card}`);
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(400)
          .send({ message: "Переданы некорректные данные карточки" });
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
        res
          .status(404)
          .send({ message: `Kарточкa id:${req.params.cardId} не найденa` });
      } else {
        res.send({ data: card });
      }
    })
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};
module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (card == null) {
        res
          .status(404)
          .send({ message: `Kарточкa id:${req.params.cardId} не найденa` });
      } else {
        res.send({ data: card });
      }
    })
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};
