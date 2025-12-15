import mongoose, { Document, Types } from "mongoose";

const Schema = mongoose.Schema;

export interface IMessage extends Document {
  creater: Types.ObjectId;
  data: string;
  date: Date;
  isReaded: boolean;
  dialog: Types.ObjectId;
  isTyping?: boolean;
  avatar?: string;
  fullName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema(
  {
    creater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    enum: ["text", "audio", "photo"],
    data: { type: String, required: true },
    date: { type: Date, default: new Date() },
    isReaded: {
      type: Boolean,
      default: false,
    },
    dialog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dialog",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Message", MessageSchema);
