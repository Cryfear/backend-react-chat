const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  avatar: String,
  fullName: {
    type: String,
    required: true
  },
  date: Date,
  isReaded: {
    type: Boolean,
    default: false
  },
  isTyping: Boolean
}, {
  timestamps: true,
});

var Message = mongoose.model('Message', MessageSchema);

module.exports = Message;