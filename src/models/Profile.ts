import mongoose, { Document, Types } from "mongoose";

const Schema = mongoose.Schema;

export interface IProfile extends Document {
  owner: Types.ObjectId;
  friends: Types.ObjectId[];
  posts: Types.ObjectId[];
  bio: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema = new Schema(
  {
    owner: {
      // чей профиль
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    friends: [
      // друзья пользователя, массив обьектов
      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    bio: { type: String, default: "Tell us about you" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Profile", ProfileSchema);
