import UserSchema from "../models/User";
import bcrypt from "bcrypt";
import express from "express";

let UsersController = {
  // test: () => {
  //   return UserSchema.findById({ _id: "5ee448c7f323f03480ef5290" })
  //     .populate("dialogs")
  //     .exec((err, dialogs) => {
  //       console.log("Populated User " + dialogs);
  //     });
  // },

  // testing populating

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

  loginUser: (req: any, res: any) => {
    UserSchema.findOne(
      {
        email: req.body.values.email,
      },
      (err, user) => {
        if (err) return err;
        return user;
      }
    ).then((data: any) => {
      if (data) {
        bcrypt.compare(req.body.values.password, data.password).then(result => {
          if (result) {
            if (req.session != null) {
              req.session.userId = data._id;
              req.session.userEmail = data.email;
            }
            res.send({ isAccess: true, userId: data._id, userEmail: data.email });
          } else {
            res.send({ isAccess: false });
          }
        });
      }
    });
  },

  logoutUser: (req: express.Request, res: express.Response) => {
    if (req.session) {
      req.session.destroy(() => {
        res.send("destroyed");
      });
    }
  },

  getMe: (req: express.Request, res: express.Response) => {
    UserSchema.findOne(
      {
        email: req.body.email,
      },
      (err, user) => {
        if (err) return res.send(err);
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
          return data;
        })
        .catch(err => {
          console.log(err);
          res.send(err);
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
