const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: 'email is required field',
    unique: true
  },
  avatar: String,
  fullName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  confirmed: {
    type: Boolean,
    default: false
  },
  last_seen: Date,
  _id: {
    type: mongoose.Schema.Types.ObjectId,
  },
}, {
  timestamps: true,
});

var User = mongoose.model('User', UserSchema);

module.exports = User;