import { io } from "../index.js";
import MessageSchema from "../models/Message.js";
import Dialog from "../models/Dialog.js";
import User from "../models/User.js";

let MessagesController = {
  findDialogMessages: async (req, res) => {
    MessageSchema.find({ dialog: req.body.dialogId })
      .sort("-date")
      .skip(Number(req.body.page) * 10)
      .limit(10)
      .then((data) => res.send(data))
      .catch(() => {
        res.status(404).send("error!");
      });
  },

  findMessage: (req, res) => {
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
    let dialog = await Dialog.findOne({
      _id: req.body.dialogId,
    });
    let me = await User.findOne({
      _id: req.body.myId,
    });

    if (dialog && me) {
      const opponent =
        dialog.users[0]._id.toString() == req.body.myId ? dialog.users[1] : dialog.users[0];

      // Создаем новое сообщение
      const newMessage = new MessageSchema({
        date: new Date(),
        isReaded: false,
        isTyping: false,
        data: req.body.data,
        dialog: dialog._id,
        creater: me._id,
      });

      // Сохраняем сообщение
      const savedMessage = await newMessage.save();

      // ПОПУЛЯЦИЯ ПОСЛЕ СОХРАНЕНИЯ
      const populatedMessage = await MessageSchema.findById(savedMessage._id);

      const updateResult = await MessageSchema.updateMany(
        {
          dialog: dialog._id,
          creater: opponent._id, // сообщения ОППОНЕНТА
          isReaded: false        // только непрочитанные
        },
        {
          $set: { isReaded: true }
        }
      );

      io.emit("qqq", populatedMessage);

      res.send(populatedMessage);
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
