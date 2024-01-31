import axios from "axios";
import Product from "../models/product.js";
import Store from "../models/store.js";
import Setting from "../models/setting.js";

export default async function startServer() {
  try {
    // const resetStock = await Product.updateMany({}, { stock: 0 });
    await Setting.findOneAndUpdate(
      {},
      { warehouseName: "ห้องสต๊อคศูนย์การเรียนรู้ขวัญตา" },
      { upsert: true }
    );
    const setting = await Setting.findOne();
    await Setting.findOneAndUpdate(
      { _id: setting._id },
      { PrinterName: "EPSON L6270 Series (Copy 1)" }
    );
    const response = await axios.post(`${process.env.URL}/startApp`, {
      name: setting.warehouseName,
    });
    // await Product.deleteMany({});
    // await Product.insertMany(response.data.data);
    // const setting = await Setting.findOne();
    // console.log(setting);

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
    const PromisePrice = response.data.data.map(async (item) => {
      await Product.updateOne({ _id: item._id }, { price: item.price });
    });
    await Promise.all(PromisePrice);
    console.log("helloworld: server started");
  } catch (error) {
    console.log(error);
  }
}
