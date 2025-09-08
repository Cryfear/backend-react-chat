import type { Request, Response } from "express";
import { io } from "../index.ts";
import MessageSchema, { type IMessage } from "../models/Message.ts";
import Dialog from "../models/Dialog.ts";
import User from "../models/User.ts";
import type { Types } from "mongoose";

interface UpdateMessageRequest {
  body: {
    avatar?: string;
    fullName?: string;
  };
  params: {
    id: string;
  };
}

interface MessageResponse {
  _id: Types.ObjectId;
  creater: Types.ObjectId;
  data: string;
  date: Date;
  isReaded: boolean;
  dialog: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MessagesController = {
  findDialogMessages: async (
    req: Request<{}, {}, { dialogId: string; page?: string }>,
    res: Response<MessageResponse[] | { error: string }>
  ) => {
    try {
      const page = Number(req.body.page) || 0;
      const messages = await MessageSchema.find({ dialog: req.body.dialogId })
        .sort("-date")
        .skip(page * 10)
        .limit(10)
        .lean()
        .exec();

      res.send(messages as MessageResponse[]);
    } catch (error) {
      res.status(404).send({ error: "Failed to fetch messages" });
    }
  },


  findMessage: async (req: Request<{ id: string }>, res: Response<MessageResponse | { error: string }>) => {
    try {
      const message = await MessageSchema.findOne({ _id: req.params.id });
      if (!message) {
        return res.status(404).send({ error: "Message not found" });
      }
      res.send(message.toObject() as MessageResponse);
    } catch (error) {
      res.status(404).send({ error: "Failed to find message" });
    }
  },

  findLastMessage: async (
    req: Request<{}, {}, { id: string }>, res: Response<{ text: string; date: Date; } | { error: string }>
  ) => {
    if (req.body.id) {
      try {
        const messages = await MessageSchema.find({ dialog: req.body.id })
          .sort("-date")
          .limit(1)
          .lean()
          .exec();

        const lastMessage = messages[0];

        if (messages.length === 0 || !lastMessage) {
          return res.status(404).send({ error: "No messages found" });
        }

        res.send({ text: lastMessage.data, date: lastMessage.date })
      } catch (error) {
        res.status(404).send({ error: "Failed to find last message" });
      }
    } else {
      res.status(400).send({ error: "Dialog ID is required" });
    }
  },

  getUnreadMessages: async (req: Request<{}, {}, { dialogId: string, userId: string }>, res: Response<{ length: number } | { error: string }>) => {
    if (req.body.dialogId && req.body.userId) {
      try {
        const messages = await MessageSchema.find({
          dialog: req.body.dialogId,
          creater: req.body.userId,
          isReaded: false,
        }).limit(100);

        res.status(200).send({ length: messages.length });
      } catch (error) {
        res.status(404).send({ error: "Failed to get unread messages" });
      }
    } else {
      res.status(400).send({ error: "Dialog ID and User ID are required" });
    }
  },

  getUnreadMessagesWithData: async (req: Request<{}, {}, { dialogId: string, userId: string, unreadedPage: number }>, res: Response<IMessage[] | { error: string }>) => {
    if (req.body.dialogId && req.body.userId) {
      try {
        const page = Number(req.body.unreadedPage) || 0;
        const messages: any = await MessageSchema.find({
          dialog: req.body.dialogId,
          creater: req.body.userId,
          isReaded: false,
        })
          .sort({ date: 1 })
          .skip(page * 10)
          .limit(10);

        res.send(messages);
      } catch (error) {
        res.status(404).send({ error: "Failed to get unread messages" });
      }
    } else {
      res.status(400).send({ error: "Dialog ID and User ID are required" });
    }
  },

  createMessage: async (req: Request<{}, {}, { dialogId: string, userId: string, myId: string, data: string }>, res: Response<IMessage | { error: string }>) => {
    try {
      const dialog = await Dialog.findOne({ _id: req.body.dialogId });
      const me = await User.findOne({ _id: req.body.myId });

      if (!dialog || !me || !dialog.users[0]) {
        return res.status(404).send({ error: "Dialog or user not found" });
      }

      const opponent = dialog.users[0]._id.toString() === req.body.myId
        ? dialog.users[1]
        : dialog.users[0];

      if (!opponent) return res.status(400).send({ error: "Dialog or user not found" });

      const newMessage = new MessageSchema({
        date: new Date(),
        isReaded: false,
        isTyping: false,
        data: req.body.data,
        dialog: dialog._id,
        creater: me._id,
      });

      const savedMessage = await newMessage.save();

      await MessageSchema.updateMany(
        {
          dialog: dialog._id,
          creater: opponent._id,
          isReaded: false
        },
        {
          $set: { isReaded: true }
        }
      );

      const lastMessageForSocket = await MessageSchema.findById(savedMessage._id);

      io.emit("new_message", lastMessageForSocket);

      res.send(lastMessageForSocket as IMessage);
    } catch (error) {
      res.status(500).send({ error: "Failed to create message" });
    }
  },

  updateMessage: async (req: Request<UpdateMessageRequest['params'], {}, UpdateMessageRequest['body']>, res: Response<IMessage | { error: string }>) => {
    // after some refactoring i'm not sure that this is works, test it later.
    try {
      if (req.body.avatar && req.body.fullName) {
        const message = await MessageSchema.findOneAndUpdate(
          { _id: req.params.id },
          { avatar: req.body.avatar, fullName: req.body.fullName },
          { new: true }
        );

        if (!message) {
          return res.status(404).send({ error: "Message not found" });
        }

        res.send(message as IMessage);

      }
    } catch (error) {
      res.status(404).send({ error: "Failed to update message" });
    }
  },

  deleteMessage: async (req: Request<{id: string}>, res: Response<any>) => {
    try {
      const result = await MessageSchema.deleteOne({ _id: req.params.id });

      if (result.deletedCount === 0) {
        return res.status(404).send({ error: "Message not found" });
      }

      res.send(result);
    } catch (error) {
      res.status(500).send({ error: "Failed to delete message" });
    }
  },
};

export default MessagesController;