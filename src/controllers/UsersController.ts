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
      const users = await UserSchema.find()
        .skip(Number(req.params.page) * 10)
        .limit(10);

      const mapedUsers = users.map((user: any): userTypes => {
        const {fullName, avatar, isOnline, id} = user;
        // мапим определенные поля, чтобы юзер не получал лишней информации, например пароля.
        return {
          fullName,
          avatar,
          isOnline,
          id,
        };
      })

      res.send(mapedUsers);
    } catch (err) {
      res.status(401).send(err);
    }
  },

  getUsersByName: (req: express.Request, res: express.Response) => {
    try {
      UserSchema.find({fullName: {'$regex': req.params.name, $options: 'i'}})
        .skip(Number(req.params.page) * 10)
        .limit(10)
        .exec((err: any, users: any) => {
          if(err) res.send('fail');
          const usersBySearch = users.map((user: any): userTypes => {
            const {fullName, avatar, isOnline, id} = user;
            // мапим определенные поля, чтобы юзер не получал лишней информации, например пароля.
            return { 
              fullName,
              avatar,
              isOnline,
              id,
            };
          });

          res.send(usersBySearch);
        });
    } catch (err) {
      res.status(401).send('fail');
    }
  },

  findUser: async (req: express.Request, res: express.Response) => {
    try {
      const user: any = await UserSchema.findOne({_id: req.params.id});
      const {fullName, avatar, isOnline, id} = user;

      // мапим определенные поля, чтобы юзер не получал лишней информации, например пароля.

      res.send({fullName, avatar, isOnline, id});
    } catch (err) {
      res.status(404).send(err);
    }
  },

  loginUser: (req: express.Request, res: express.Response) => {
    UserSchema.findOne({
      email: req.body.values.email,
    })
      .then((user: any) => {
        bcrypt
          .compare(req.body.values.password, user.password)
          .then((result) => {
            if (result) {
              const accessToken = jwt.sign(
                {email: user.email},
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
                avatar: user.avatar,
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
    })
      .then((user: any) => {
        const {email, fullName, _id: id} = user;
        res.send({email, fullName, id, responseCode: "success"});
      })
      .catch(() => {
        res.send({responseCode: "Not logged in"});
      });
  },

  createUser: (req: express.Request, res: express.Response) => {
    bcrypt.hash(req.body.password, 4, (_, hash) => {
      new UserSchema({
        email: req.body.email,
        fullName: req.body.name,
        password: hash,
      })
        .save()
        .then((data: Object) => {
          res.send({...data, responseCode: "success"});
          return data;
        })
        .catch((err: string) => {
          res.send({responseCode: "fail"});
          return err;
        });
    });
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
