import express from "express";
import { io } from "../index";
import MessageSchema from "../models/Message";
import Dialog from "../models/Dialog";
import User from "../models/User";
import { CallbackError } from "mongoose";

let MessagesController = {
  findDialogMessages: async (req: express.Request, res: express.Response) => {
    let dialog = await Dialog.findOne({
      users: { $all: [req.body.id2, req.body.id1] },
    });
    if (dialog) {
      MessageSchema.find({ dialog: dialog.id })
        .then((data: any) => {
          res.send(data);
        })
        .catch((err) => {
          res.send(err);
        });
    } else {
      res.status(404).send("error!");
    }
  },

  findMessage: (req: express.Request, res: express.Response) => {
    MessageSchema.findOne(
      {
        _id: req.params.id,
      },
      (err: CallbackError, message: any) => {
        if (err) res.send(err);
        res.status(404).send(message);
      }
    );
  },

  findLastMessage: async (req: express.Request, res: express.Response) => {
    if (req.body.id) {
      MessageSchema.find({ dialog: req.body.id, })
        .sort("-date")
        .limit(1)
        .exec(function (err, message) {
          if (err) res.status(404).send(err);
          console.log('success');
          res.send(message);
        });
    }
  },

  getUnreadMessages: async (req: express.Request, res: express.Response) => {
    if (req.body.id) {
      MessageSchema.find({ dialog:req.body.id, isRead: false }).exec(function (
        err,
        message
      ) {
        if (err) res.status(404).send(err);
        res.send(message);
      });
    }
  },

  createMessage: async (req: express.Request, res: express.Response) => {
    let dialog = await Dialog.findOne({
      users: { $all: [req.body.id2, req.body.id1] },
    });
    let me = await User.findOne({
      _id: req.body.id2,
    });

    console.log(req.body.data, req.body.id1, req.body.id2);
    if (dialog && me) {
      new MessageSchema({
        date: new Date(),
        isReaded: false,
        isTyping: false,
        data: req.body.data,
        dialog: dialog._id,
        creater: me._id,
      })
        .populate("dialog")
        .execPopulate()
        .then((data) => {
          io.emit("qqq", data);

          res.send(data);
          data.save();
        })
        .catch((err) => {
          res.status(404).send(err);
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
      (err: CallbackError, message: any) => {
        if (err) res.status(404).send(message);
        res.send(message);
      }
    );
  },

  deleteMessage: (req: express.Request, res: express.Response) => {
    MessageSchema.deleteOne(
      {
        _id: req.params.id,
      },
      undefined,
      (message: any) => {
        if (message) res.send(message);
        res.send(message);
      }
    );
  },
};

export default MessagesController;
