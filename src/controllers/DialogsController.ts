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
    let user = await User.findOne({ _id: req.body.id_1 });
    let user2 = await User.findOne({ _id: req.body.id_2 });

    if (user && user2) {
      let dio = await Dialog.findOne({ users: [user._id, user2._id] });
      if (dio === null) {
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
      } else {
        res.send("такой диалог уже существует.");
      }
    }
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
