import express from "express";
import { io } from "../index";
import MessageSchema from "../models/Message";
import Dialog from "../models/Dialog";
import User from "../models/User";
import { CallbackError } from "mongoose";

let MessagesController = {
  findDialogMessages: async (req: express.Request, res: express.Response) => {
    MessageSchema.find({
      $or: [
        { dialog: req.body.dialogId, isReaded: true },
        { dialog: req.body.dialogId, creater: req.body.myId },
      ],
    })
      .sort("-date")
      .skip(Number(req.body.page) * 10)
      .limit(10)
      .then((data: any) => res.send(data))
      .catch(() => {
        res.status(404).send("error!");
      });
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
      MessageSchema.find({ dialog: req.body.id })
        .sort("-date")
        .limit(1)
        .then((message: any) => {
          try {
            res.send({ text: message[0].data, date: message[0].date });
          } catch (err) {
            res.status(404).send(err);
          }
        });
    }
  },

  getUnreadMessages: async (req: express.Request, res: express.Response) => {
    if (req.body.dialogId) {
      MessageSchema.find({
        dialog: req.body.dialogId,
        creater: req.body.userId,
        isReaded: false,
      })
        .limit(100)
        .then((messages: any) => {
          try {
            res.status(200).send({ length: messages.length });
          } catch (err) {
            res.status(404).send(err);
          }
        })
        .catch((err: any) => {
          if (err) res.status(404).send(err);
        });
    }
  },

  getUnreadMessagesWithData: async (
    req: express.Request,
    res: express.Response
  ) => {
    if (req.body.dialogId) {
      MessageSchema.find({
        dialog: req.body.dialogId,
        creater: req.body.userId,
        isReaded: false,
      })
        .sort([["date", 1]])
        .skip(Number(req.body.unreadedPage) * 10)
        .limit(10)
        .then((messages: any) => {
          try {
            res.send(messages);
          } catch (err) {
            res.status(404).send(err);
          }
        })
        .catch((err: any) => {
          if (err) res.status(404).send(err);
        });
    }
  },

  createMessage: async (req: express.Request, res: express.Response) => {
    let dialog = await Dialog.findOne({
      _id: req.body.dialogId,
    });
    let me = await User.findOne({
      _id: req.body.myId,
    });

    const opponent =
      dialog.users[0]._id == req.body.myId ? dialog.users[1] : dialog.users[0];

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
        .then((data: any) => {
          io.emit("qqq", data);

          MessageSchema.updateMany(
            {
              dialog: dialog._id,
              creater: opponent._id,
            },
            { $set: { isReaded: true } },
            {},
            (err: any, writeResult: any) => {}
          );

          res.send(data);
          data.save();
        })
        .catch((err: any) => {
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
