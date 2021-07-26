import Dialog from "../models/Dialog";
import Message from "../models/Message";
import User from "../models/User";
import express from "express";

let DialogsController = {
  findDialog: async (req: express.Request, res: express.Response) => {
    const dialog = Dialog.findOne({
      users: { $all: [req.params.id, req.params.id2] },
    }).exec((err: any, dialog: any) => {
      if (dialog) {
        res.send(dialog);
      } else {
        res.status(400).send("error");
      }
    });
  },

  findMyDialogs: async (req: express.Request, res: express.Response) => {
    const dialogs = await Dialog.find({
      users: { $in: [req.params.id] },
    })
      .skip(Number(req.body.page) * 10)
      .limit(10);

    if (dialogs) {
      return res.send(dialogs);
    }
    res.status(400).send("error");
  },

  createDialog: async (req: express.Request, res: express.Response) => {
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
          .then((data: any) => {
            res.send(data._id);
            data.save();
          })
          .catch((err: any) => {
            console.log('unsuccesful create dialog');
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
      (err) => {
        if (err) return console.log(err);
        res.send(err);
      }
    );
  },

  deleteDialog: async (req: express.Request, res: express.Response) => {
    try {
      const dialog = await Dialog.deleteOne({ _id: req.params.id }).then(
        (data: any) => res.send(data)
      );
    } catch (err) {
      console.log("deleted wasnt successful.");
    }
  },
};

export default DialogsController;
