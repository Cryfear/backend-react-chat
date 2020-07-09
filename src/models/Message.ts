import mongoose from "mongoose";

const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    creater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    data: { type: String, required: true }, // текст сообщения, его содержимое
    date: { type: Date, default: new Date() },
    isReaded: {
      type: Boolean,
      default: false,
    },
    isTyping: { type: Boolean, default: false },
    dialog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dialog",
    },
  },
  {
    timestamps: true,
  }
);

var Message = mongoose.model("Message", MessageSchema);

export default Message;
