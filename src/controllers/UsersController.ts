import UserSchema from "../models/User";
import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";

interface userTypes {
  fullName: string;
  avatar: string;
  isOnline: boolean;
  id: string;
}

let UsersController = {
  getUsers: async (req: express.Request, res: express.Response) => {
    try {
      const user = await UserSchema.find()
        .skip(Number(req.params.page) * 20)
        .limit(20);
      res.send(
        user.map(
          (user: any): userTypes => {
            const { fullName, avatar, isOnline, id } = user;
            // мапим определенные поля, чтобы юзер не получал лишней информации, например пароля.
            return {
              fullName,
              avatar,
              isOnline,
              id,
            };
          }
        )
      );
    } catch (err) {
      res.status(401).send(err);
    }
  },

  findUser: async (req: express.Request, res: express.Response) => {
    try {
      const user: any = await UserSchema.findOne({ _id: req.params.id });
      const { fullName, avatar, isOnline, id } = user;

      // мапим определенные поля, чтобы юзер не получал лишней информации, например пароля.

      res.send({ fullName, avatar, isOnline, id });
    } catch (err) {
      res.status(404).send(err);
    }
  },

  loginUser: (req: express.Request, res: express.Response) => {
    console.log(req.body)
    UserSchema.findOne({
      email: req.body.values.email,
    })
      .then((user: any) => {
        bcrypt.compare(req.body.values.password, user.password).then((result) => {
          if (result) {
            const accessToken = jwt.sign(
              { email: user.email },
              process.env.SESSION_SECRET,
              {
                expiresIn: process.env.JWT_MAXAGE,
              }
            );
            res.header("auth-token", accessToken).send({
              token: accessToken,
              email: user.email,
              fullName: user.fullName,
              id: user._id,
              responseCode: "success",
            });
          } else {
            res.send("Username or password incorrect");
          }
        });
      })
      .catch(() => {
        res.send("Username or password incorrect");
      });
  },

  logoutUser: (req: express.Request, res: express.Response) => {
    if (req.session) {
      req.session.destroy(() => {
        res.send("destroyed");
        console.log("logout");
      });
    }
  },

  getMe: (req: express.Request, res: express.Response) => {
    UserSchema.findOne({
      email: req.body.email,
    }).then((user: any) => {
      console.log(user)
      const { email, fullName, _id: id } = user;
      res.send({ email, fullName, id, responseCode: "success" });
    }).catch(data => {
      res.status(400).send({ responseCode: "User is not found" });
    })
  },

  createUser: (req: express.Request, res: express.Response) => {
    bcrypt.hash(req.body.password, 4, (_: Error, hash: string) => {
      console.log(req.body);
      new UserSchema({
        email: req.body.email,
        fullName: req.body.name,
        password: hash,
      }).save().then((data: Object) => {
        console.log("created user", data);
        res.send({ ...data, responseCode: "success" });
        return data;
      })
        .catch((err: string) => {
          console.log(err);
          res.send({ responseCode: "fail" });
          return err;
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
        console.log("user updated");
      }
    );
  },

  deleteUser: (req: express.Request, res: express.Response) => {
    UserSchema.deleteOne(
      {
        _id: req.params.id,
      },
      undefined,
      (data) => {
        if (data) return console.log(data);
        res.send(data);
        console.log("user deleted");
      }
    );
  },
};

export default UsersController;
