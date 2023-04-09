const Card = require('../models/card');

const NotFoundError = require('../errors/not-found-err');
const Forbidden = require('../errors/forbidden-err');
// const NotValidError = require('../errors/not-valid-err');

module.exports.findCard = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => {
      // const digitRegExp = /^https?:\/\/(www.)?[\w.\-_~:/?#[\]@!$&'()*+,;=]*/g;
      // if (!card.link.match(digitRegExp)) {
      //   throw new NotValidError('В поле для картинки должна быть передана ссылка');
      // } else {
      res.send({ data: card });
      // }
    })
    .catch(next);
};
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Карточка не найдена');
      } else if (card.owner !== req.user._id) {
        throw new Forbidden('Это не ваша карточка');
      } else {
        Card.findByIdAndRemove(req.params.cardId);
        res.send({ data: card });
      }
    })
    .catch(next);
};
module.exports.putLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card == null) {
        throw new NotFoundError('карточка не найдена');
      } else {
        res.send({ data: card });
      }
    })
    .catch(next);
};
module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card == null) {
        throw new NotFoundError('карточка не найдена');
      } else {
        res.send({ data: card });
      }
    })
    .catch(next);
};
