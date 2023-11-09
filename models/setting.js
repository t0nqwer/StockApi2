import { Schema, model } from "mongoose";

const settingSchema = new Schema({
  warehouseName: { type: String, required: true },
  barcodeLocation: { type: String, required: true },
});

const Setting = model("Setting", settingSchema);
export default Setting;
