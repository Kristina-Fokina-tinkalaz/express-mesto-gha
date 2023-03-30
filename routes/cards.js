const router = require("express").Router();
const {
  findCard,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
} = require("../controllers/cards");

router.get("/", findCard);
router.post("/", createCard);
router.delete("/:cardId", deleteCard);
router.put("/:cardId/likes", putLike);
router.delete("/:cardId/likes", deleteLike);

module.exports = router;
