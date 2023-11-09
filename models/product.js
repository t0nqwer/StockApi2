import { Schema, model } from "mongoose";

const productSchema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true, default: "Product" },
  price: { type: Number, required: true, default: 0 },
  size: { type: String },
  fabric: { type: String },
  design: { type: String },
  supplier: { type: String, required: true, default: "0" },
  stock: { type: Number, required: true, default: 0 },
});

const Product = model("Product", productSchema);

export default Product;
