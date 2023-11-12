import { Schema, model } from "mongoose";

const transferSchema = new Schema({
  _id: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  product: { type: Array, required: true },
  createAt: { type: Date, default: Date.now },
  arriveAt: { type: Date },
  status: { type: String, default: "pending" },
  type: { type: String, default: "transfer" },
  online: { type: Boolean, default: false },
});

const Transfer = model("Transfer", transferSchema);
export default Transfer;
