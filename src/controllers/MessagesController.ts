import express from "express";

import MessageSchema from "../models/Message";
import Dialog from "../models/Dialog";

let MessagesController = {
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
      users: ["5ef4260bb253992934c20def", "5ef5eb112f86f22aec465c1f"],
    });
    if (dialog) {
      new MessageSchema({
        date: new Date(),
        isReaded: true,
        isTyping: false,
        dialog: dialog._id,
      })
        .populate("dialog")
        .execPopulate()
        .then(data => {
          res.send(data);
          data.save();
          console.log(data);
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
