import type { Response, Request } from "express";
import Dialog, { type IDialog } from "../models/Dialog.ts";
import User from "../models/User.ts";
import MessageSchema from "../models/Message.ts";

let DialogsController = {
  findDialog: async (req: Request<{ id: string; id2: string }>, res: Response<IDialog | { error: string }>) => {
    try {
      const { id, id2 } = req.params;
      if (!id || !id2) return res.status(400).send({ error: "Missing IDs" });

      const dialog: any = await Dialog.findOne({
        users: { $all: [id, id2] },
      }).lean();

      if (!dialog) return res.status(404).send({ error: "Dialog does not exist" });

      res.send(dialog);
    } catch (err) {
      console.error(err);
      res.status(200).send({ error: "Server error" });
    }
  },

  findMyDialogs: async (req: Request<{ id: string }>, res: Response<IDialog[] | { error: string }>) => {
    try {
      const userId = req.params.id;
      const page = Number(req.body.page) || 0;
      const pageSize = 10;

      if (!userId || userId === "null") {
        return res.status(400).send({ error: "User ID is required" });
      }

      const dialogs = await Dialog.find({
        users: { $in: [userId] },
      })
        .skip(page * pageSize)
        .limit(pageSize)
        .lean();

      const dialogIds = dialogs.map((d) => d._id);

      const lastMessages = await MessageSchema.aggregate([
        { $match: { dialog: { $in: dialogIds } } },
        { $sort: { date: -1 } },
        {
          $group: {
            _id: "$dialog",
            lastMessage: { $first: "$$ROOT" },
            unreadCount: {
              $sum: { $cond: [{ $eq: ["$isReaded", false] }, 1, 0] },
            },
          },
        },
      ]);

      const lastMessagesMap = lastMessages.reduce((acc, item) => {
        acc[item._id.toString()] = {
          lastMessage: item.lastMessage,
          unreadCount: item.unreadCount,
        };
        return acc;
      }, {} as Record<string, { lastMessage: any; unreadCount: number }>);

      const convertedDialogs: any = dialogs.map((dialog) => ({
        ...dialog,
        lastMessage: lastMessagesMap[dialog._id.toString()]?.lastMessage || null,
        unreadCount: lastMessagesMap[dialog._id.toString()]?.unreadCount || 0,
      }));

      res.send(convertedDialogs);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Server error" });
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
          const newDialog = new Dialog({
            name: req.body.name,
            users: [user._id, user2._id],
          });
          await newDialog.save();
          await newDialog.populate("users");
          res.send(newDialog._id);
        } else {
          res.send(dio._id);
        }
      }
    }
  },

  updateDialog: async (req: Request<{ avatar: string; fullName: string; id: string }>) => {
    const updateDialog = {
      avatar: req.body.avatar,
      fullName: req.body.fullName,
    };
    Dialog.findOneAndUpdate({ _id: req.params.id }, updateDialog, { new: true });
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
