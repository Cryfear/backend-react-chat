import type { Request, Response } from "express";
import { io } from "../index.ts";
import MessageSchema, { type IMessage } from "../models/Message.ts";
import Dialog from "../models/Dialog.ts";
import User from "../models/User.ts";

interface UpdateMessageRequest {
  body: {
    avatar?: string;
    fullName?: string;
  };
  params: {
    id: string;
  };
}

interface DeleteMessageRequest {
  params: {
    id: string;
  };
}

// Интерфейсы для ответов
interface LastMessageResponse {
  text: string;
  date: Date;
}

interface UnreadMessagesResponse {
  length: number;
}

const MessagesController = {
  findDialogMessages: async (req: Request<any>, res: Response<IMessage[] | { error: string }>) => {
    try {
      const page = Number(req.body.page) || 0;
      const messages: any = await MessageSchema.find({ dialog: req.body.dialogId })
        .sort("-date")
        .skip(page * 10)
        .limit(10);
      
      res.send(messages);
    } catch (error) {
      res.status(404).send({ error: "Failed to fetch messages" });
    }
  },

  findMessage: async (req: Request<{ id: string }>, res: Response<IMessage | { error: string }>) => {
    try {
      const message: any = await MessageSchema.findOne({ _id: req.params.id });
      if (!message) {
        return res.status(404).send({ error: "Message not found" });
      }
      res.send(message);
    } catch (error) {
      res.status(404).send({ error: "Failed to find message" });
    }
  },

  findLastMessage: async (req: any, res: Response<LastMessageResponse | { error: string }>) => {
    if (req.body.id) {
      try {
        const messages: any = await MessageSchema.find({ dialog: req.body.id })
          .sort("-date")
          .limit(1);
        
        if (messages.length === 0) {
          return res.status(404).send({ error: "No messages found" });
        }

        res.send({ 
          text: messages[0].data, 
          date: messages[0].date 
        });
      } catch (error) {
        res.status(404).send({ error: "Failed to find last message" });
      }
    } else {
      res.status(400).send({ error: "Dialog ID is required" });
    }
  },

  getUnreadMessages: async (req: Request<any>, res: Response<UnreadMessagesResponse | { error: string }>) => {
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

  getUnreadMessagesWithData: async (req: any, res: Response<IMessage[] | { error: string }>) => {
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

  createMessage: async (req: any, res: Response<IMessage | { error: string }>) => {
    try {
      const dialog:any = await Dialog.findOne({ _id: req.body.dialogId });
      const me:any = await User.findOne({ _id: req.body.myId });

      if (!dialog || !me) {
        return res.status(404).send({ error: "Dialog or user not found" });
      }

      const opponent:any = dialog.users[0]._id.toString() === req.body.myId 
        ? dialog.users[1] 
        : dialog.users[0];

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

      // Обновляем непрочитанные сообщения оппонента
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

      // Получаем полное сообщение с популяцией если нужно
      const populatedMessage: any = await MessageSchema.findById(savedMessage._id);

      io.emit("new_message", populatedMessage);

      res.send(populatedMessage!);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).send({ error: "Failed to create message" });
    }
  },

  updateMessage: async (req: Request<UpdateMessageRequest['params'], {}, UpdateMessageRequest['body']>, res: Response<IMessage | { error: string }>) => {
    try {
      const updateMessage: any = {};
      
      if (req.body.avatar) updateMessage.avatar = req.body.avatar;
      if (req.body.fullName) updateMessage.fullName = req.body.fullName;

      const message: any = await MessageSchema.findOneAndUpdate(
        { _id: req.params.id },
        updateMessage,
        { new: true }
      );

      if (!message) {
        return res.status(404).send({ error: "Message not found" });
      }

      res.send(message);
    } catch (error) {
      res.status(404).send({ error: "Failed to update message" });
    }
  },

  deleteMessage: async (req: Request<DeleteMessageRequest['params']>, res: Response<any>) => {
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