
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

schema.index({ name: 1, userId: 1 },{ unique: true });

schema.set('timestamps', true);

schema.set('toObject', {
  virtuals: true,
  transform: (doc, result) => {
    delete result._id;
    delete result.__v;
  }
});

module.exports = mongoose.model('Tag', schema);