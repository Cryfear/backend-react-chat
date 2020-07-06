import express from "express";

import MessageSchema from "../models/Message";
import Dialog from "../models/Dialog";
import User from "../models/User";

let MessagesController = {
  findDialogMessages: async (req: express.Request, res: express.Response) => {
    let dialog = await Dialog.findOne({
      users: [req.body.id2, req.body.id1],
    });
    if (dialog) {
      MessageSchema.find({ dialog: dialog.id })
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.send(err);
        });
    } else {
      res.send("error!");
    }
  },

  findMessage: (req: express.Request, res: express.Response) => {
    MessageSchema.findOne(
      {
        _id: req.params.id,
      },
      (err, message) => {
        if (err) res.send(err);
        res.send(message);
      }
    );
  },

  createMessage: async (req: express.Request, res: express.Response) => {
    let dialog = await Dialog.findOne({
      users: [req.body.id2, req.body.id1], // id2 - это я
    });
    let me = await User.findOne({
      _id: req.body.id2,
    });
    console.log(dialog, req.body.data, req.body.id1, req.body.id2);
    if (dialog && me) {
      new MessageSchema({
        date: new Date(),
        isReaded: true,
        isTyping: false,
        data: req.body.data,
        dialog: dialog._id,
        creater: me._id,
      })
        .populate("dialog")
        .execPopulate()
        .then(data => {
          res.send(data);
          data.save();
        })
        .catch(err => {
          res.send(err);
        });
    }
  },

  updateMessage: (req: express.Request, res: express.Response) => {
    const updateMessage = {
      avatar: req.body.avatar,
      fullName: req.body.fullName,
    };
    MessageSchema.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      updateMessage,
      {
        new: true,
      },
      (err, message) => {
        if (err) res.send(message);
        res.send(message);
      }
    );
  },

  deleteMessage: (req: express.Request, res: express.Response) => {
    MessageSchema.deleteOne(
      {
        _id: req.params.id,
      },
      message => {
        if (message) res.send(message);
        res.send(message);
      }
    );
  },
};

export default MessagesController;
