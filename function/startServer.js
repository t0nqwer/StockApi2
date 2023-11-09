import axios from "axios";
import Product from "../models/product.js";
import Store from "../models/store.js";

export default async function startServer() {
  try {
    const response = await axios.get(`${process.env.URL}/startApp`);
    // await Product.deleteMany({});
    // await Product.insertMany(response.data.data);

    const product = await Product.find().select("_id");
    const currentProduct = product.map((item) => item._id);
    const newProduct = response.data.data.map((item) => item._id);
    const difference = newProduct.filter((x) => !currentProduct.includes(x));
    const deleteProduct = currentProduct.filter((x) => !newProduct.includes(x));
    const newProductData = response.data.data.filter((item) =>
      difference.includes(item._id)
    );
    await Product.deleteMany({ _id: { $in: deleteProduct } });
    await Product.insertMany(newProductData);
    await Store.deleteMany({});
    await Store.insertMany(response.data.stores);
    console.log("helloworld: server started");
  } catch (error) {}
}
