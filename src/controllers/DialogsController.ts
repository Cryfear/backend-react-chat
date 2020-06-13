import DialogSchema from "../models/Dialog";
import express from "express";

let DialogsController = {
  findDialog: (req: express.Request, res: express.Response) => {
    DialogSchema.findOne({
      _id: req.params.id,
    })
      .populate("users")
      .exec((err, dialog) => {
        if (err) return console.log(err);
        res.json(dialog);
      });
  },

  createDialog: (req: express.Request, res: express.Response) => {
    const Dialog = new DialogSchema({
      fullName: req.body.fullName,
      avatar: req.body.avatar || "none",
    });
    Dialog.save((err: Error) => {
      if (err) return console.log(err);
      console.log("created dialog");
      res.send(Dialog);
    });
  },

  updateDialog: (req: express.Request, res: express.Response) => {
    const updateDialog = {
      avatar: req.body.avatar,
      fullName: req.body.fullName,
    };
    DialogSchema.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      updateDialog,
      {
        new: true,
      },
      err => {
        if (err) return console.log(err);
        res.send(err);
      }
    );
  },

  deleteDialog: (req: express.Request, res: express.Response) => {
    DialogSchema.deleteOne(
      {
        _id: req.params.id,
      },
      err => {
        if (err) return console.log(err);
        res.send(err);
      }
    );
  },
};

export default DialogsController;
