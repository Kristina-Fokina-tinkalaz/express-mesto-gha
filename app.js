const express = require('express');

const mongoose = require('mongoose');

const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '642134e13a91ddd93819dcb0',
  };
  next();
});

app.use('/cards', require('./routes/cards'));

app.use('/users', require('./routes/users'));

app.use((req, res) => {
  res.status(404).send({ message: 'Адрес не существует' });
});
