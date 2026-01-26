import type { Response, Request } from "express";
import Dialog from "../models/Dialog.js";
import User from "../models/User.js";
import MessageSchema from "../models/Message.js";
import mongoose, { Types } from "mongoose";

type FindDialogParams = {
  id: string;
  id2: string;
};

type ErrorResponse = { error: string };

type CreateDialogBody = {
  id_1: string;
  id_2: string;
  name?: string;
};

type UpdateDialogBody = {
  avatar?: string;
  fullName?: string;
};

type LastMessageAgg = {
  _id: mongoose.Types.ObjectId;
  lastMessage: {
    data: string;
    date: Date;
  };
  unreadCount: number;
};

export type LeanDialog = {
  _id: Types.ObjectId;
  users: Types.ObjectId[];
  lastMessageDate: Date;
  createdAt: Date;
  updatedAt: Date;
};

type CreateDialogResponse = { id: string } | { error: string };

const DialogsController = {
  findDialog: async (req: Request<FindDialogParams>, res: Response<LeanDialog | ErrorResponse>) => {
    try {
      const { id, id2 } = req.params;
      if (!id || !id2) return res.status(400).send({ error: "Missing IDs" });

      const dialog = await Dialog.findOne({
        users: { $all: [id, id2] },
      }).lean();

      if (!dialog) return res.status(200).send({ error: "Dialog does not exist" });

      res.send(dialog);
    } catch (err) {
      console.error(err);
      res.status(400).send({ error: "Server error" });
    }
  },

  findMyDialogs: async (req: Request<{ id: string }, { page?: number }>, res: Response) => {
    try {
      const userId = new mongoose.Types.ObjectId(req.params.id);
      const page = Number(req.body.page) || 0;
      const pageSize = 10;

      const dialogs = await Dialog.find({
        users: userId,
      })
        .sort({ lastMessageDate: -1 })
        .skip(page * pageSize)
        .limit(pageSize)
        .lean<LeanDialog[]>();

      if (!dialogs) return res.status(404).send({ error: "dialogs not found" });

      const dialogIds = dialogs.map((d) => d._id);

      const lastMessages = await MessageSchema.aggregate<LastMessageAgg>([
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
        ]),
      );

      const companionIds = dialogs.map((d) => d.users.find((u) => !u.equals(userId)));

      const companions = await User.find(
        { _id: { $in: companionIds } },
        {
          password: 0,
          email: 0,
          confirmed: 0,
        },
      ).lean();

      const companionsMap = Object.fromEntries(companions.map((user) => [user._id.toString(), user]));

      const result = dialogs.map((dialog) => {
        const companion = dialog.users.find((u) => !u.equals(userId));

        if (!companion) {
          throw new Error("Companion not found");
        }

        const companionId = companion.toString();
        const last = lastMessagesMap[dialog._id.toString()];

        return {
          ...dialog,
          user: companionsMap[companionId] ?? null,
          lastMessage: last?.lastMessage?.data ?? null,
          lastMessageDate: last?.lastMessage?.date ?? null,
          unreadCount: last?.unreadCount ?? 0,
        };
      });

      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Server error" });
    }
  },

  createDialog: async (req: Request<{}, CreateDialogBody>, res: Response<CreateDialogResponse>) => {
    if (req.body.id_1 === req.body.id_2) {
      return res.status(400).send({
        error: "you cant create a dialog with yourself",
      });
    }

    if (req.body) {
      let user = await User.findOne({ _id: req.body.id_1 });
      let user2 = await User.findOne({ _id: req.body.id_2 });

      if (user && user2) {
        let dio = await Dialog.findOne({ users: { $all: [user, user2] } });
        if (!dio) {
          const newDialog = new Dialog({
            users: [user._id, user2._id],
          });

          await newDialog.save();

          res.send({ id: newDialog._id.toString() });
        } else {
          res.send({ id: dio._id.toString() });
        }
      }
    }
  },

  updateDialog: async (req: Request<{ id: string }, UpdateDialogBody>, res: Response) => {
    const updateDialog = {
      avatar: req.body.avatar,
      fullName: req.body.fullName,
    };
    Dialog.findOneAndUpdate({ _id: req.params.id }, updateDialog, { new: true });
  },

  deleteDialog: async (req: Request<{ id: string }>, res: Response) => {
    try {
      await Dialog.deleteOne({ _id: req.params.id }).then((data) => res.send(data));
    } catch (err) {}
  },
};

export default DialogsController;
