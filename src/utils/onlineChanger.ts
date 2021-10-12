import express from "express";
import User from "../models/User";

type userTYPer = {
  isOnline: boolean;
  last_seen: any,
  save: Function;
}

export default (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const userId = req.header("id");

  if (userId) {
    try {
      User.findOne({
        _id: userId,
      }).then((user: userTYPer) => {
        user.isOnline = true;
        user.last_seen = new Date();
        user.save();

        setTimeout(() => {
          user.isOnline = Date.now() - user.last_seen < 55000;
          user.save();
        }, 50000);
      });
    } catch (err) {
      
    }
  } 
  next();
};
