import express from "express";
import User from "../models/User";

export default (req: express.Request, _: express.Response, next: express.NextFunction) => {
  User.findOneAndUpdate(
    { _id: "5ef4260bb253992934c20def" }, // это будет обновление онлайна, not realized now
    {
      last_seen: new Date(),
    },
    { new: true },
    () => {}
  );

  next();
};
