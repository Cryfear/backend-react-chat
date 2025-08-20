import { io } from "../index.js";
import MessageSchema from "../models/Message.js";
import Dialog from "../models/Dialog.js";
import User from "../models/User.js";

let MessagesController = {
  findDialogMessages: async (req, res) => {
    MessageSchema.find({
      $or: [
        { dialog: req.body.dialogId, isReaded: true },
        { dialog: req.body.dialogId, creater: req.body.myId },
      ],
    })
      .sort("-date")
      .skip(Number(req.body.page) * 10)
      .limit(10)
      .then((data) => res.send(data))
      .catch(() => {
        res.status(404).send("error!");
      });
  },

  findMessage: (req, res) => {
    console.log(req.params, req.body);
    MessageSchema.findOne(
      {
        _id: req.params.id,
      },
      (err, message) => {
        if (err) res.send(err);
        res.status(404).send(message);
      }
    );
  },

  findLastMessage: async (req, res) => {
    if (req.body.id) {
      MessageSchema.find({ dialog: req.body.id })
        .sort("-date")
        .limit(1)
        .then((message) => {
          try {
            res.send({ text: message[0].data, date: message[0].date });
          } catch (err) {
            res.status(404).send(err);
          }
        });
    }
  },

  getUnreadMessages: async (req, res) => {
    if (req.body.dialogId) {
      MessageSchema.find({
        dialog: req.body.dialogId,
        creater: req.body.userId,
        isReaded: false,
      })
        .limit(100)
        .then((messages) => {
          try {
            res.status(200).send({ length: messages.length });
          } catch (err) {
            res.status(404).send(err);
          }
        })
        .catch((err) => {
          if (err) res.status(404).send(err);
        });
    }
  },

  getUnreadMessagesWithData: async (
    req,
    res
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
        .then((messages) => {
          try {
            res.send(messages);
          } catch (err) {
            res.status(404).send(err);
          }
        })
        .catch((err) => {
          if (err) res.status(404).send(err);
        });
    }
  },

  createMessage: async (req, res) => {
    console.log(req.body, 'message data', req.body.dialogId);
    let dialog = await Dialog.findOne({
      _id: req.body.dialogId,
    });
    let me = await User.findOne({
      _id: req.body.myId,
    });
    console.log(req.body, 'create message body');
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
        .then((data) => {
          io.emit("qqq", data);

          MessageSchema.updateMany(
            {
              dialog: dialog._id,
              creater: opponent._id,
            },
            { $set: { isReaded: true } },
            {},
            (err, writeResult) => {}
          );

          res.send(data);
          data.save();
        })
        .catch((err) => {
          res.status(404).send(err);
        });
    }
  },

  updateMessage: (req, res) => {
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
        if (err) res.status(404).send(message);
        res.send(message);
      }
    );
  },

  deleteMessage: (req, res) => {
    MessageSchema.deleteOne(
      {
        _id: req.params.id,
      },
      undefined,
      (message) => {
        if (message) res.send(message);
        res.send(message);
      }
    );
  },
};

export default MessagesController;
