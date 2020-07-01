import Dialog from "../models/Dialog";
import User from "../models/User";
import express from "express";

let DialogsController = {
  findDialog: (req: express.Request, res: express.Response) => {
    Dialog.findOne({
      users: [req.params.id, req.params.id_s],
    })
      .populate("users")
      .exec((err, dialog) => {
        if (err) return res.json(err);
        res.json(dialog);
      });
  },

  createDialog: async (req: express.Request, res: express.Response) => {
    let user = await User.findOne({ email: "w23123d@ddd.d" });
    let user2 = await User.findOne({ email: "testagainguys@loll.ru" });
    if (user && user2)
      new Dialog({
        name: req.body.name,
        users: [user._id, user2._id],
      })
        .populate("users")
        .execPopulate()
        .then(data => {
          res.send(data);
          data.save();
          console.log(data);
        })
        .catch(err => {
          res.send(err);
        });
  },

  updateDialog: async (req: express.Request, res: express.Response) => {
    const updateDialog = {
      avatar: req.body.avatar,
      fullName: req.body.fullName,
    };
    Dialog.findOneAndUpdate(
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
    Dialog.deleteOne(
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
