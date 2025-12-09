import type { Response, Request } from "express";
import Dialog, { type IDialog } from "../models/Dialog.ts";
import User from "../models/User.ts";

let DialogsController = {
  findDialog: async (req: Request<{ id: string; id2: string }>, res: Response<IDialog | { error: string }>) => {
    if (req.params.id) {
      Dialog.findOne({
        users: { $all: [req.params.id, req.params.id2] },
      })
        .then((dialog) => {
          if (dialog) {
            res.send(dialog);
          } else {
            res.status(200).send({ error: "dialog is not exist yet" });
          }
        })
        .catch((err) => {
          res.status(200).send({ error: "dialog is not exist yet" });
        });
    }
  },

  findMyDialogs: async (req: Request<{ id: string }>, res: Response<IDialog[] | { error: string }>) => {
    if (req.params.id && req.params.id !== "null") {
      Dialog.find({
        users: { $in: [req.params.id] },
      })
        .skip(Number(req.body.page) * 10)
        .limit(10)
        .then((dialogs) => {
          res.send(dialogs);
        })
        .catch((err) => res.status(400).send({ error: err }));
    }
  },
  createDialog: async (req: Request<{ id_1: string; id_2: string }>, res: Response) => {
    if (req.body.id_1 === req.body.id_2) res.send({ error: "you cant create a dialig with yourself" });

    if (req.body) {
      let user = await User.findOne({ _id: req.body.id_1 });
      let user2 = await User.findOne({ _id: req.body.id_2 });

      if (user && user2) {
        let dio = await Dialog.findOne({ users: { $all: [user, user2] } });
        if (!dio) {
          new Dialog({
            name: req.body.name,
            users: [user._id, user2._id],
          })
            .populate("users")
            .then((data) => {
              res.send(data._id);
              data.save();
              return data;
            });
        } else {
          res.send(dio._id);
        }
      }
    }
  },

  updateDialog: async (req: Request<{ avatar: string; fullName: string; id: string }>) => {
    // not realised function! wait update
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
      }
    );
  },

  deleteDialog: async (req: Request, res: Response) => {
    // not realised function! wait update
    try {
      await Dialog.deleteOne({ _id: req.params.id }).then((data) => res.send(data));
    } catch (err) {
      console.log("deleted wasnt successful.");
    }
  },
};

export default DialogsController;
