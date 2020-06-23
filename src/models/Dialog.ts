import mongoose from "mongoose";
const Schema = mongoose.Schema;

const DialogSchema = new Schema(
  {
    partnerId: Number,
    avatar: String,
    fullName: {
      type: String,
      required: true,
    },
    date: Date,
    lastMessage: String,
    unreadedCount: Number,
    _id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    // partners: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    // },
  },
  {
    timestamps: true,
  }
);

var Dialog = mongoose.model("Dialog", DialogSchema, "dialogs");

export default Dialog;
