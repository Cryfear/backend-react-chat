import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: "email is required field",
      unique: true,
      min: 6,
      max: 255,
    },
    avatar: {
      type: String,
      default:
        "https://c7.uihere.com/files/833/38/538/user-profile-computer-software-internet-bot-user.jpg",
    },
    fullName: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    password: {
      type: String,
      required: true,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    isOnline: { type: Boolean, default: false },
    last_seen: Date,
  }
  // {
  //   timestamps: true, узнать потом что это
  // }
);

const User = mongoose.model("User", UserSchema);

export default User;
