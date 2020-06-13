import express, { NextFunction } from "express";
import UserModel from "../models/User";

export default (next: NextFunction) => {
  UserModel.findOneAndUpdate(
    {
      _id: "5ed99ba9c9cd73285c8ec990",
    },
    {
      last_seen: new Date(),
    },
    {
      new: true,
    },
    () => {}
  );
  next();
};