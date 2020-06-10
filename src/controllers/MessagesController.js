const MessageSchema = require('../models/Message');

let MessagesController = {
  findMessage: (req, res) => {
    MessageSchema.findOne({
      _id: req.params.id
    }, (err, message) => {
      if (err) return console.log(err);
      res.send(message);
    });
  },

  createMessage: (req, res) => {
    const Message = new MessageSchema({
      fullName: req.body.fullName,
      avatar: req.body.avatar || 'none'
    })
    Message.save(() => {
      console.log('created mesage');
      res.send(Message);
    })
  },

  updateMessage: (req, res) => {
    const updateMessage = {
      avatar: req.body.avatar,
      fullName: req.body.fullName,
    }
    MessageSchema.findOneAndUpdate({
        _id: req.params.id
      },
      updateMessage, {
        new: true,
        useFindAndModify: false
      },
      (err, message) => {
        if (err) return console.log(err);
        res.send(message);
      });
  },

  deleteMessage: (req, res) => {
    MessageSchema.deleteOne({
        _id: req.params.id
      },
      function (err, message) {
        if (err) return console.log(err);
        res.send(message);
      });
  }
}

module.exports = MessagesController;