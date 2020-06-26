import mongoose from "mongoose";
const Schema = mongoose.Schema;

const DialogSchema = new Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

var Dialog = mongoose.model("Dialog", DialogSchema);

export default Dialog;
