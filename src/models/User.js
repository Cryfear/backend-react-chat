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
      default: 'https://www.kindpng.com/picc/m/24-248528_internet-user-png-person-in-charge-icon-transparent.png'
    },
    isDefaultAvatar: {
      type: Boolean,
      default: true
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
    last_seen: { type: Date, default: new Date() },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

export default User;
