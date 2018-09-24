'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  fullName: { type: String }
});

userSchema.set('toObject', {
  virtuals: true,     // include built-in virtual `id`
  versionKey: false,  // remove `__v` version key
  transform: (doc, result) => {
    delete result._id;
    delete result.__v;
    delete result.password;
  }
});

userSchema.methods.validatePassword = function (password) {
  return password === this.password;
};

module.exports = mongoose.model('User', userSchema);
