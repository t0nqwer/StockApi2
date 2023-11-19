import Product from "../models/product.js";

export const NewProduct = async (data) => {
  try {
    await Product.insertMany(data);
  } catch (error) {
    console.log(error);
  }
};
export const PriceChange = async (data) => {
  try {
    await Product.updateOne({ _id: data.barcode }, { price: data.price });
  } catch (error) {
    console.log(error);
  }
};
export const DeleteProduct = async (data) => {
  try {
    await Product.deleteOne({ _id: data });
  } catch (error) {
    console.log(error);
  }
};
