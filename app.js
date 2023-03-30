const express = require("express");
const { PORT = 3000 } = process.env;
const path = require("path");

const mongoose = require("mongoose");
const app = express();
mongoose.connect("mongodb://localhost:27017/mestodb");

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "642134e13a91ddd93819dcb0",
  };
  next();
});

app.use("/cards", require("./routes/cards"));
app.use("/users", require("./routes/users"));
app.use((req, res) => {
  res.status(404).send({ message: "Адрес не существует" });
});

// app.use(express.static(path.join(__dirname, "public")));

// app.get("/users", (req, res) => {
//   res.send("hello");
// });
// app.get("/users/:id", (req, res) => {
//   const { id } = req.params;
// });
// app.delete("/cards/:cardId", (req, res) => {
//   const { cardId } = req.params;
// });

app.listen(PORT, () => {
  console.log(`Privetiki :)`);
});
