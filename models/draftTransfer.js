import { Schema, model } from "mongoose";

const draftTransferSchema = new Schema({
  _id: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  product: { type: Array, required: true },
  createAt: { type: Date, default: Date.now },
  type: { type: String, default: "transfer" },
});

const DraftTransfer = model("DraftTransfer", draftTransferSchema);
export default DraftTransfer;
