const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String, minlength: 2, maxlength: 30, default: 'Жак-Ив Кусто',
  },
  about: {
    type: String, minlength: 2, maxlength: 30, default: 'Исследователь',
  },
  avatar: { type: String, default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png' },
  email: {
    type: String, required: true, unique: true, select: false,
  },
  password: { type: String, required: true },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
