import type { Response, Request } from "express";
import Dialog, { type IDialog } from "../models/Dialog.ts";
import User from "../models/User.ts";
import MessageSchema from "../models/Message.ts";
import mongoose from "mongoose";

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

  findMyDialogs: async (req: Request<{ id: string }>, res: Response) => {
    try {
      const userId = new mongoose.Types.ObjectId(req.params.id);
      const page = Number(req.body.page) || 0;
      const pageSize = 10;

      const dialogs: any = await Dialog.find({
        users: userId,
      })
        .skip(page * pageSize)
        .limit(pageSize)
        .lean();

      if (!dialogs) return res.status(404).send({ error: "dialogs not found" });

      const dialogIds = dialogs.map((d) => d._id);

      const lastMessages = await MessageSchema.aggregate([
        {
          $match: {
            dialog: { $in: dialogIds },
          },
        },
        { $sort: { date: -1 } },
        {
          $group: {
            _id: "$dialog",
            lastMessage: { $first: "$$ROOT" },
            unreadCount: {
              $sum: {
                $cond: [
                  {
                    $and: [{ $eq: ["$isReaded", false] }, { $ne: ["$creater", userId] }],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]);

      const lastMessagesMap = Object.fromEntries(
        lastMessages.map((item) => [
          item._id.toString(),
          {
            lastMessage: item.lastMessage,
            unreadCount: item.unreadCount,
          },
        ])
      );

      const companionIds = dialogs.map((d) => d.users.find((u: any) => !u.equals(userId)));

      const companions = await User.find(
        { _id: { $in: companionIds } },
        {
          password: 0,
          email: 0,
          confirmed: 0,
        }
      ).lean();

      const companionsMap = Object.fromEntries(companions.map((user) => [user._id.toString(), user]));

      const result = dialogs.map((dialog) => {
        const companionId = dialog.users.find((u: any) => !u.equals(userId)).toString();

        return {
          ...dialog,
          user: companionsMap[companionId],
          lastMessage: lastMessagesMap[dialog._id.toString()]?.lastMessage.data ?? null,
          lastMessageDate: lastMessagesMap[dialog._id.toString()]?.lastMessage.date ?? null,
          unreadCount: lastMessagesMap[dialog._id.toString()]?.unreadCount.data ?? 0,
        };
      });

      res.send(result);
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
    try {
      await Dialog.deleteOne({ _id: req.params.id }).then((data) => res.send(data));
    } catch (err) {
      console.log("deleted wasnt successful.");
    }
  },
};

export default DialogsController;
