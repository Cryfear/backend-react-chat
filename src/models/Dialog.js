import mongoose from "mongoose";
const Schema = mongoose.Schema;

const DialogSchema = new Schema(
  {
    users: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    isTyping: { type: Boolean, default: false },
  },

  {
    timestamps: true,
  }
);

var Dialog = mongoose.model("Dialog", DialogSchema);

export default Dialog;
