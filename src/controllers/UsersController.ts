import UserSchema from "../models/User";
import bcrypt from "bcrypt";
import express from "express";

let UsersController = {
  findUser: (req: express.Request, res: express.Response) => {
    UserSchema.findOne(
      {
        _id: req.params.id,
      },
      (err: express.Errback, user: express.Send) => {
        console.log(user);
        if (err) return console.log(err);
        res.send(user);
      }
    );
  },

  createUser: (req: express.Request, res: express.Response) => {
    bcrypt.hash(req.body.password, 4, (err: Error, hash: string) => {
      UserSchema.create({
        email: req.body.email,
        fullName: req.body.fullName,
        password: hash,
        avatar: req.body.avatar || "none",
      })
        .then(data => {
          console.log("created user");
          res.send(data);
        })
        .catch((err: express.Errback) => {
          console.log(err);
          res.send(err);
        });
    });
  },

  updateUser: (req: express.Request, res: express.Response) => {
    const updateUser = {
      avatar: req.body.avatar,
      fullName: req.body.fullName,
      password: req.body.password,
    };
    UserSchema.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      updateUser,
      {
        new: true,
      },
      (err: Error, user) => {
        if (err) return res.send(err);
        res.send(user);
      }
    );
  },

  deleteUser: (req: express.Request, res: express.Response) => {
    UserSchema.deleteOne(
      {
        _id: req.params.id,
      },
      data => {
        if (data) return console.log(data);
        res.send(data);
      }
    );
  },
};

export default UsersController;
