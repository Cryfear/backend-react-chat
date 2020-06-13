import express from "express";

import MessageSchema from "../models/Message";

let MessagesController = {
  findMessage: (req: express.Request, res: express.Response) => {
    MessageSchema.findOne(
      {
        _id: req.params.id,
      },
      (err, message) => {
        if (err) return console.log(err);
        res.send(message);
      }
    );
  },

  createMessage: (req: express.Request, res: express.Response) => {
    const Message = new MessageSchema({
      fullName: req.body.fullName,
      avatar: req.body.avatar || "none",
    });
    Message.save(() => {
      console.log("created mesage");
      res.send(Message);
    });
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
        if (err) return res.send(message);
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
        if (message) return console.log(message);
        res.send(message);
      }
    );
  },
};

export default MessagesController;
