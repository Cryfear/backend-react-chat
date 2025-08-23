import UserSchema from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

let UsersController = {
  getUsers: async (req, res) => {
    try {
      const users = await UserSchema.find()
        .skip(Number(req.params.page) * 10)
        .limit(10);

      const mapedUsers = users.map((user) => {
        const { fullName, isOnline, id } = user;
        // мапим определенные поля, чтобы юзер не получал лишней информации, например пароля.
        return {
          fullName,
          avatar: user.isDefaultAvatar
            ? user.avatar
            : `${process.env.BACKEND_URL}:${process.env.PORT}/${user.avatar}`,
          isOnline,
          id,
        };
      });

      res.send(mapedUsers);
    } catch (err) {
      res.status(401).send(err);
    }
  },

  getUsersByName: (req, res) => {
    try {
      UserSchema.find({ fullName: { $regex: req.params.name, $options: "i" } })
        .skip(Number(req.params.page) * 10)
        .limit(10)
        .exec((err, users) => {
          if (err) res.send("fail");
          const usersBySearch = users.map((user) => {
            const { fullName, isOnline, id } = user;
            // мапим определенные поля, чтобы юзер не получал лишней информации, например пароля.
            return {
              fullName,
              avatar: user.isDefaultAvatar
                ? user.avatar
                : `${process.env.BACKEND_URL}:${process.env.PORT}/${user.avatar}`,
              isOnline,
              id,
            };
          });

          res.send(usersBySearch);
        });
    } catch (err) {
      res.status(401).send("fail");
    }
  },

  findUser: async (req, res) => {
    try {
      const user = await UserSchema.findOne({ _id: req.params.id });
      const { fullName, isOnline, id } = user;

      const avatar = user.isDefaultAvatar
        ? user.avatar
        : `${process.env.BACKEND_URL}:${process.env.PORT}/${user.avatar}`;

      // мапим определенные поля, чтобы юзер не получал лишней информации, например пароля.

      res.send({ fullName, avatar, isOnline, id });
    } catch (err) {
      res.status(404).send(err);
    }
  },

  changeUserName: async (req, res) => {
    if(req.body.newNickName) {
      try {
        UserSchema.findOne({
          email: req.body.email,
        }).then((user) => {
          user.fullName = req.body.newNickName;
          user.save();
          res.status(200).send({responseCode: "success"});
        });
      } catch (err) {
        res.status(400).send("Username weren't change");
      }
    }
    else res.status(400).send("Username weren't change")
  },

  uploadAvatar: (req, res) => {
    if (!req.files) {
      return res.status(500).send({ msg: "file is not found" });
    }

    const myFile = req.files.file;

    if (/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(myFile.name)) {
      myFile.mv(`${__dirname}../../../public/${myFile.name}`, function (err) {
        if (err) {
          return res.status(500).send({ msg: "something wrong" });
        }

        UserSchema.findOne({
          email: req.header("email"),
        }).then((user) => {
          user.avatar = myFile.name;
          user.isDefaultAvatar = false;
          user.save();

          return res.send({
            file: myFile.name,
            path: `/${myFile.name}`,
            responseCode: "success",
          });
        });
      });
    } else {
      res.status(400).send("error");
    }
  },

  changeUserPassword: (req, res) => {
    try {
      UserSchema.findOne({
        email: req.body.email,
      }).then((user) => {
        bcrypt.compare(req.body.oldPassword, user.password).then((result) => {
          if (result) {
            bcrypt.hash(req.body.newPassword, 4, (_, hash) => {
              user.password = hash;
              user.save();
            });

            res.send({responseCode: "success"});
          } else {
            res.status(400).send("Invalid old password");
          }
        });
      });
    } catch (err) {
      res.status(400).send("Password weren't change");
    }
  },

  loginUser: (req, res) => {
    console.log(req.body);
    UserSchema.findOne({
      email: req.body.values.email,
    })
      .then((user) => {
        bcrypt.compare(req.body.values.password, user.password).then((result) => {
          if (result) {
            const accessToken = jwt.sign({ email: user.email }, process.env.SESSION_SECRET, {
              expiresIn: process.env.JWT_MAXAGE,
            });
            res.header("auth-token", accessToken).send({
              token: accessToken,
              email: user.email,
              fullName: user.fullName,
              id: user._id,
              avatar: user.isDefaultAvatar
                ? user.avatar
                : `${process.env.BACKEND_URL}:${process.env.PORT}/${user.avatar}`,
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

  logoutUser: (req, res) => {
    if (req.session) {
      req.session.destroy(() => {
        res.send("destroyed");
      });
    }
  },

  getMe: (req, res) => {
    if(req.body) {
      UserSchema.findOne({
        email: req.body.email
    })
      .then((user) => {
        const { email, fullName, isOnline, _id: id } = user;
        res.send({
          email,
          fullName,
          isOnline,
          avatar: user.isDefaultAvatar
            ? user.avatar
            : `${process.env.BACKEND_URL}:${process.env.PORT}/` + user.avatar,
          id,
          responseCode: "success",
        });
      })
      .catch(() => {
        res.send({ responseCode: "Not logged in" });
      });
    } else {
      res.send({ responseCode: "Not logged in" });
    }
    
  },

  createUser: (req, res) => {
    console.log(req.body);
    bcrypt.hash(req.body.password, 4, (_, hash) => {
      new UserSchema({
        email: req.body.email,
        fullName: req.body.name,
        password: hash,
      })
        .save()
        .then((data) => {
          console.log('created');
          res.send({ ...data, responseCode: "success" });
          return data;
        })
        .catch((err) => {
          console.log('wtf');
          res.send({ responseCode: "fail" });
          console.log(err);
          return err;
        });
    });
  },

  deleteUser: (req, res) => {
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
