import mongoose from "mongoose";

const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    data: { type: String, required: true }, // текст сообщения, его содержимое
    date: Date,
    isReaded: {
      type: Boolean,
      default: false,
    },
    isTyping: Boolean,
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
