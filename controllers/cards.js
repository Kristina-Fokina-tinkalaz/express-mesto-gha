const Card = require('../models/card');

const { ERROR_VALID, ERROR_NOTFOUND, ERROR_DEF } = require('../errors');

module.exports.findCard = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(ERROR_DEF).send({ message: 'Произошла ошибка' }));
};
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(ERROR_VALID)
          .send({ message: 'Переданы некорректные данные карточки' });
      } else {
        res.status(ERROR_DEF).send({ message: 'Произошла ошибка' });
      }
    });
};
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card == null) {
        res.status(ERROR_NOTFOUND).send({ message: 'Карточка не найдена' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(ERROR_VALID)
          .send({ message: 'Передан невалидный ID карточки' });
      } else {
        res.status(ERROR_DEF).send({ message: 'Произошла ошибка' });
      }
    });
};
module.exports.putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card == null) {
        res.status(ERROR_NOTFOUND).send({ message: 'карточка не найдена' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_VALID).send({
          message: 'Передан невалидный ID карточки',
        });
      } else {
        res.status(ERROR_DEF).send({ message: 'Произошла ошибка' });
      }
    });
};
module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card == null) {
        res.status(ERROR_NOTFOUND).send({ message: 'карточка не найдена' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(ERROR_VALID)
          .send({ message: 'Передан невалидный ID карточки' });
      } else {
        res.status(ERROR_DEF).send({ message: 'Произошла ошибка' });
      }
    });
};
