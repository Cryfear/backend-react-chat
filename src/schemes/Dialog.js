const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DialogSchema = new Schema({
  partnerId: Number,
  avatar: String,
  fullName: {
    type: String,
    required: true
  },
  date: Date,
  lastMessage: String,
  unreadedCount: Number
}, {
  timestamps: true,
});

var Dialog = mongoose.model('Dialog', DialogSchema);

module.exports = Dialog;