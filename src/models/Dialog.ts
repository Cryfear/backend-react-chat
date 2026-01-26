import mongoose, { Document, Types } from "mongoose";
const Schema = mongoose.Schema;

export interface IDialog extends Document {
  users: Types.ObjectId[];
  lastMessageDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DialogSchema = new Schema(
  {
    users: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    lastMessageDate: { type: Date, default: null },
  },

  {
    timestamps: true,
  }
);

var Dialog = mongoose.model("Dialog", DialogSchema);

export default Dialog;
