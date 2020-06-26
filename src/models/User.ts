import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: "email is required field",
      unique: true,
    },
    avatar: String,
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    last_seen: Date,
  }
  // {
  //   timestamps: true, узнать потом что это
  // }
);

const User = mongoose.model("User", UserSchema);

export default User;
