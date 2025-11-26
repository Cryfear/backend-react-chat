import type { IUser } from "./../models/User.ts";
import type { Request, Response } from "express";
import UserSchema from "../models/User.ts";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";
import { dirname, extname, join } from "path";
import { v4 as uuidv4 } from "uuid";
import type { FileArray, UploadedFile } from "express-fileupload";
import { generateToken } from "../utils/jwtSign.ts";
import type { DeleteResult } from "mongodb";
import Profile from "../models/Profile.ts";
import mongoose from "mongoose";

interface UserResponse {
  fullName: string;
  avatar: string;
  isOnline: boolean;
  id: string;
}

interface LoginResponse {
  token: string;
  email: string;
  fullName: string;
  id: string;
  avatar: string;
  responseCode: string;
}

interface GetMeResponse {
  email: string;
  fullName: string;
  isOnline: boolean;
  avatar: string;
  id: string;
  responseCode: string;
}

const UsersController = {
  getUsers: async (
    req: Request<{ page?: string }>,
    res: Response<UserResponse[] | { error: string }>
  ) => {
    if (req.params && req.params.page !== "null") {
      try {
        const page = Number(req.params.page) || 0;
        const users = await UserSchema.find()
          .skip(page * 10)
          .limit(10);

        const mappedUsers: UserResponse[] = users.map((user) => {
          return {
            fullName: user.fullName,
            avatar: `${process.env.BACKEND_URL}:${process.env.PORT}/${user.avatar}`,
            isOnline: user.isOnline,
            id: user._id.toString(),
          };
        });

        res.send(mappedUsers);
      } catch (err) {
        res.status(401).send({ error: (err as Error).message });
      }
    } else {
      res.status(400).send({ error: "Invalid parameters" });
    }
  },

  getUsersByName: async (
    req: Request<{ name?: string; page?: string }>,
    res: Response<UserResponse[] | { error: string }>
  ) => {
    if (req.params && req.params.name !== "null") {
      try {
        const page = Number(req.params.page) || 0;
        const users = await UserSchema.find({
          fullName: { $regex: req.params.name || "", $options: "i" },
        })
          .skip(page * 10)
          .limit(10);

        const usersBySearch: UserResponse[] = users.map((user) => {
          return {
            fullName: user.fullName,
            avatar: `${process.env.BACKEND_URL}:${process.env.PORT}/${user.avatar}`,
            isOnline: user.isOnline,
            id: user._id.toString(),
          };
        });

        res.send(usersBySearch);
      } catch (err) {
        res.status(401).send({ error: "Failed to search users" });
      }
    } else {
      res.status(400).send({ error: "Invalid search parameters" });
    }
  },

  findUser: async (
    req: Request<{ id?: string }>,
    res: Response<UserResponse | { error: string }>
  ) => {
    if (req.params.id && req.params.id !== "null") {
      try {
        const user = await UserSchema.findOne({ _id: req.params.id });
        if (!user) {
          return res.status(404).send({ error: "User not found" });
        }

        res.send({
          fullName: user.fullName,
          avatar: `${process.env.BACKEND_URL}:${process.env.PORT}/${user.avatar}`,
          isOnline: user.isOnline,
          id: user._id.toString(),
        });
      } catch (err) {
        res.status(404).send({ error: (err as Error).message });
      }
    } else {
      res.status(400).send({ error: "Invalid user ID" });
    }
  },

  changeUserName: async (
    req: Request<{ email: string; newNickName: string }>,
    res: Response<{ responseCode: string } | { error: string }>
  ) => {
    if (req.body.newNickName) {
      try {
        const user = await UserSchema.findOne({ email: req.body.email });
        if (!user) {
          return res.status(404).send({ error: "User not found" });
        }

        user.fullName = req.body.newNickName;
        await user.save();
        res.status(200).send({ responseCode: "success" });
      } catch (err) {
        res.status(400).send({ error: "Username wasn't changed" });
      }
    } else {
      res.status(400).send({ error: "Username wasn't changed" });
    }
  },

  uploadAvatar: async (
    req: Request<{ files: FileArray }>,
    res: Response<
      | {
          file: string;
          path: string;
          responseCode: string;
        }
      | { error: string; msg?: string }
    >
  ) => {
    try {
      if (!req.files || !req.files.file) {
        return res
          .status(400)
          .send({ error: "File is not found", msg: "file is not found" });
      }

      const myFile = req.files.file as UploadedFile;
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      const fileExt = extname(myFile.name);
      const uniqueName = `${uuidv4()}${fileExt}`;

      if (!/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(uniqueName)) {
        return res.status(400).send({ error: "Invalid file type" });
      }

      const uploadPath = join(__dirname, "../../public", uniqueName);

      await myFile.mv(uploadPath);

      const user = await UserSchema.findOne({
        email: req.header("email") || "",
      });
      if (!user) {
        return res
          .status(404)
          .send({ error: "User not found", msg: "User not found" });
      }

      user.avatar = uniqueName;
      user.isDefaultAvatar = false;
      await user.save();

      res.send({
        file: uniqueName,
        path: `/public/${uniqueName}`,
        responseCode: "success",
      });
    } catch (err) {
      console.error("Upload error:", err);
      res
        .status(500)
        .send({ error: "Something went wrong", msg: "something wrong" });
    }
  },

  changeUserPassword: async (
    req: Request<{ email: string; oldPassword: string; newPassword: string }>,
    res: Response<{ responseCode: string } | { error: string }>
  ) => {
    if (req.body) {
      try {
        const user = await UserSchema.findOne({ email: req.body.email });
        if (!user) {
          return res.status(404).send({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(
          req.body.oldPassword,
          user.password
        );
        if (!isMatch) {
          return res.status(400).send({ error: "Invalid old password" });
        }

        const hash = await bcrypt.hash(req.body.newPassword, 4);
        user.password = hash;
        await user.save();

        res.send({ responseCode: "success" });
      } catch (err) {
        res.status(400).send({ error: "Password wasn't changed" });
      }
    } else {
      res.status(400).send({ error: "Invalid request" });
    }
  },

  loginUser: async (
    req: Request<{
      values: {
        email: string;
        password: string;
      };
    }>,
    res: Response<LoginResponse | { error: string }>
  ) => {
    if (req.body) {
      try {
        const user = await UserSchema.findOne({ email: req.body.values.email });
        if (!user) {
          return res.send({ error: "Username or password incorrect" });
        }

        const isMatch = await bcrypt.compare(
          req.body.values.password,
          user.password
        );
        if (!isMatch) {
          return res.send({ error: "Username or password incorrect" });
        }

        const accessToken = generateToken({ email: user.email });

        res.header("auth-token", accessToken).send({
          token: accessToken,
          email: user.email,
          fullName: user.fullName,
          id: user._id.toString(),
          avatar: `${process.env.BACKEND_URL}:${process.env.PORT}/${user.avatar}`,
          responseCode: "success",
        });
      } catch (err) {
        res.send({ error: "Username or password incorrect" });
      }
    } else {
      res.status(400).send({ error: "Invalid request" });
    }
  },

  logoutUser: (
    req: Request,
    res: Response<{ message: string } | { error: string }>
  ) => {
    req.session.userId = null;
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).send({ error: "Logout failed" });
        }
        res.send({ message: "destroyed" });
      });
    } else {
      res.send({ message: "destroyed" });
    }
  },

  getMe: async (
    req: Request<{ id: string; email: string }>,
    res: Response<GetMeResponse | { responseCode: string }>
  ) => {
    if (req.body && req.body.id !== "null" && req.body.id !== "undefined") {
      try {
        const user: IUser | null = await UserSchema.findOne({
          email: req.body.email,
        });
        if (!user) {
          return res.send({ responseCode: "Not logged in" });
        }

        res.send({
          email: user.email,
          fullName: user.fullName,
          isOnline: user.isOnline,
          avatar: `${process.env.BACKEND_URL}:${process.env.PORT}/${user.avatar}`,
          id: user._id.toString(),
          responseCode: "success",
        });
      } catch (err) {
        res.send({ responseCode: "Not logged in" });
      }
    } else {
      res.send({ responseCode: "Not logged in" });
    }
  },

  createUser: async (req: Request<{
  email: string;
  name: string;
  password: string;
}>, res: Response<{ responseCode: string } | { error: string }>) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 4);
    
    // Создаем и сохраняем пользователя
    const user = new UserSchema({
      email: req.body.email,
      fullName: req.body.name,
      password: hash,
    });
    const savedUser = await user.save();

    // Создаем и сохраняем профиль
    const profile = new Profile({
      owner: savedUser._id, // используем ID сохраненного пользователя
    });
    await profile.save(); // ждем сохранения профиля

    res.send({ 
      ...savedUser.toObject(), 
      responseCode: "success" 
    });

  } catch (err: any) {
    console.error('Error creating user:', err);
    
    // Если ошибка уникальности (дубликат email)
    if (err.code === 11000) {
      res.status(400).send({ error: "User already exists" });
    } else {
      res.status(500).send({ error: "Registration failed" });
    }
  }
},

  deleteUser: async (
    req: Request<{ id: string }>,
    res: Response<DeleteResult | { error: string }>
  ) => {
    try {
      const result = await UserSchema.deleteOne({ _id: req.params.id });

      if (result.deletedCount === 0) {
        return res.status(404).send({ error: "User not found" });
      }

      res.send(result as DeleteResult);
    } catch (err) {
      res.status(500).send({ error: "Failed to delete user" });
    }
  },
};

export default UsersController;
