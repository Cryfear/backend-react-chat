import UserSchema from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";
import { dirname, extname, join } from "path";
import { v4 as uuidv4 } from 'uuid';

let UsersController = {
  getUsers: async (req, res) => {
    if (req.params && req.params !== 'null') {
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
    }
  },

  getUsersByName: (req, res) => {
    if (req.params && req.fullName !== 'null') {
      try {
        UserSchema.find({ fullName: { $regex: req.params.name, $options: "i" } })
          .skip(Number(req.params.page) * 10)
          .limit(10)
          .then((users) => {
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
    }
  },

  findUser: async (req, res) => {
    if (req.params.id !== 'null' && req.params.id) {
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
    }
  },

  changeUserName: async (req, res) => {
    if (req.body.newNickName) {
      try {
        UserSchema.findOne({
          email: req.body.email,
        }).then((user) => {
          user.fullName = req.body.newNickName;
          user.save();
          res.status(200).send({ responseCode: "success" });
        });
      } catch (err) {
        res.status(400).send("Username weren't change");
      }
    }
    else res.status(400).send("Username weren't change")
  },

  uploadAvatar: (req, res) => {

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const myFile = req.files.file;

    const fileExt = extname(myFile.name); // например .jpg
    const uniqueName = `${uuidv4()}${fileExt}`; // например 550e8400-e29b-

    if (!req.files) {
      return res.status(400).send({ msg: "file is not found" });
    }


    if (/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(uniqueName)) {
      // нормальный путь
      const uploadPath = join(__dirname, "../../public", uniqueName);

      myFile.mv(uploadPath, (err) => {
        if (err) {
          console.error("Ошибка при сохранении файла:", err);
          return res.status(500).send({ msg: "something wrong" });
        }

        UserSchema.findOne({ email: req.header("email") }).then((user) => {
          if (!user) {
            return res.status(404).send({ msg: "User not found" });
          }

          user.avatar = uniqueName;
          user.isDefaultAvatar = false;
          user.save();

          return res.send({
            file: uniqueName,
            path: `/public/${uniqueName}`, // путь для фронта
            responseCode: "success",
          });
        });
      });
    } else {
      res.status(400).send("Invalid file type");
    }
  },

  changeUserPassword: (req, res) => {
    if (req.body !== 'null') {
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

              res.send({ responseCode: "success" });
            } else {
              res.status(400).send("Invalid old password");
            }
          });
        });
      } catch (err) {
        res.status(400).send("Password weren't change");
      }
    }
  },

  loginUser: (req, res) => {
    if (req.body !== 'null') {
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
    }

  },

  logoutUser: (req, res) => {
    req.session.userId = null;
    if (req.session) {
      req.session.destroy(() => {
        res.send("destroyed");
      });
    }
  },

  getMe: (req, res) => {
    if (req.body && req.body.id !== 'null') {
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
        if (data) {
          res.send(data);
          console.log("user deleted");
        }
      }
    );
  },
};

export default UsersController;
