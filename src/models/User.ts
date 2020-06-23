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
    // dialogs: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Dialog",
    // },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema, "users");

export default User;
