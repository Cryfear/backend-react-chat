import Dialog from "../models/Dialog";
import Message from "../models/Message";
import User from "../models/User";
import express from "express";

let DialogsController = {
  findDialog: async (req: express.Request, res: express.Response) => {
    console.log(req.params);
    const dialog = Dialog.findOne({
      users: { $all: [req.params.id, req.params.id2] },
    }).exec((err, dialog) => {
      if (dialog) {
        res.send(dialog);
      } else {
        res.status(400).send("error");
      }
    });
  },

  findMyDialog: async (req: express.Request, res: express.Response) => {
    console.log(req.params);
    const dialog = Dialog.find({
      users: { $in: [req.params.id] },
    }).exec((err, dialog) => {
      if (dialog) {
        res.send(dialog);
      } else {
        res.status(400).send("error");
      }
    });
  },

  createDialog: async (req: express.Request, res: express.Response) => {
    let user = await User.findOne({ _id: req.body.id_1 });
    let user2 = await User.findOne({ _id: req.body.id_2 });

    if (user && user2) {
      console.log(user._id, user2._id);
      let dio = await Dialog.findOne({ users: { $all: [user, user2] } });
      if (dio === null) {
        new Dialog({
          name: req.body.name,
          users: [user._id, user2._id],
        })
          .populate("users")
          .execPopulate()
          .then(data => {
            res.send("success");
            data.save();
          })
          .catch(err => {
            res.send(err);
          });
      } else {
        const messages = await Message.find({ dialog: dio._id });
        res.send(messages);
      }
    }
  },

  updateDialog: async (req: express.Request, res: express.Response) => {
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
      err => {
        if (err) return console.log(err);
        res.send(err);
      }
    );
  },

  deleteDialog: (req: express.Request, res: express.Response) => {
    Dialog.deleteOne(
      {
        _id: req.params.id,
      },
      err => {
        if (err) return console.log(err);
        res.send(err);
      }
    );
  },
};

export default DialogsController;
