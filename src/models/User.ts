import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  email: string;
  avatar: string;
  isDefaultAvatar: boolean;
  fullName: string;
  password: string;
  confirmed: boolean;
  isOnline: boolean;
  last_seen: Date;
  _id: string;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 6,
      maxlength: 255,
    },
    avatar: {
      type: String,
      default: `/bdd9aaee8c129b1d0a7180512c6f7ae5.jpg`,
    },
    isDefaultAvatar: {
      type: Boolean,
      default: true,
    },
    fullName: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 255,
    },
    password: {
      type: String,
      required: true,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    last_seen: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

interface IUserModel extends Model<IUser> {}

export default mongoose.model<IUser, IUserModel>("User", UserSchema);
