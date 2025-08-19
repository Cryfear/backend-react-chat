import Dialog from "../models/Dialog.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

let DialogsController = {
  findDialog: async (req, res) => {
    Dialog.findOne({
      users: { $all: [req.params.id, req.params.id2] },
    }).exec((_, dialog) => {
      if (dialog) {
        res.send(dialog);
      } else {
        res.status(404).send("error");
      }
    });
  },

  findMyDialogs: async (req, res) => {
    Dialog.find({
      users: { $in: [req.params.id] },
    })
      .skip(Number(req.body.page) * 10)
      .limit(10)
      .then((dialogs) => {
        res.send(dialogs);
      })
      .catch((err) => res.status(400).send("error"));
  },

  createDialog: async (req, res) => {
    let user = await User.findOne({ _id: req.body.id_1 });
    let user2 = await User.findOne({ _id: req.body.id_2 });
    if (user && user2) {
      let dio = await Dialog.findOne({ users: { $all: [user, user2] } });
      if (dio === null) {
        new Dialog({
          name: req.body.name,
          users: [user._id, user2._id],
        })
          .populate("users")
          .execPopulate()
          .then((data) => {
            res.send(data._id);
            data.save();
          })
          .catch((err) => {
            console.log("unsuccesful create dialog");
          });
      } else {
        const messages = await Message.find({ dialog: dio._id });
        res.send(messages);
      }
    }
  },

  updateDialog: async (req, res) => {
    const updateDialog = {
      avatar: req.body.avatar,
      fullName: req.body.fullName,
    };
    Dialog.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      updateDialog,
      {
        new: true,
      },
      (err) => {
        if (err) return console.log(err);
        res.send(err);
      }
    );
  },

  deleteDialog: async (req, res) => {
    try {
      const dialog = await Dialog.deleteOne({ _id: req.params.id }).then(
        (data) => res.send(data)
      );
    } catch (err) {
      console.log("deleted wasnt successful.");
    }
  },
};

export default DialogsController;
