import { Schema, model } from "mongoose";

const storeSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  openDate: { type: Date, required: true },
  closeDate: { type: Date },
  type: { type: String, required: true },
});

const Store = model("Store", storeSchema);
export default Store;
