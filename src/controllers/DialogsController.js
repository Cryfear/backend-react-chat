const DialogSchema = require('../schemes/Dialog');

let DialogsController = {
  findDialog: (req, res) => {
    DialogSchema.findOne({
      _id: req.params.id
    }, (err, dialog) => {
      if (err) return console.log(err);
      res.send(dialog);
    });
  },

  createDialog: (req, res) => {
    const Dialog = new DialogSchema({
      fullName: req.body.fullName,
      avatar: req.body.avatar || 'none'
    })
    Dialog.save((err, dialog) => {
      if (err) return console.log(err);
      console.log('created dialog');
      res.send(Dialog);
    })
  },

  updateDialog: (req, res) => {
    const updateDialog = {
      avatar: req.body.avatar,
      fullName: req.body.fullName,
    }
    DialogSchema.findOneAndUpdate({
        _id: req.params.id
      },
      updateDialog, {
        new: true,
        useFindAndModify: false
      },
      (err, dialog) => {
        if (err) return console.log(err);
        res.send(dialog);
      });
  },

  deleteDialog: (req, res) => {
    DialogSchema.deleteOne({
        _id: req.params.id
      },
      function (err, dialog) {
        if (err) return console.log(err);
        res.send(dialog);
      });
  }
}

module.exports = DialogsController;