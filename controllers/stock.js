import Product from "../models/product.js";
import axios from "axios";
import Transfer from "../models/transfer.js";
import Store from "../models/store.js";
import DraftTransfer from "../models/draftTransfer.js";
import Setting from "../models/setting.js";
import { uid } from "uid";
import { ServerSocket } from "../socket.io/server.js";
import moment from "moment-timezone";
export const getProducts = async (req, res) => {
  const { name, code, price, isStock, barcode } = req.query;
  try {
    console.log(price);
    if (code !== "") {
      const product = await Product.find({
        $and: [
          { stock: isStock === "true" ? { $gt: 0 } : { $gte: 0 } },
          { price: price === "" ? { $gte: 0 } : +price },
          { name: { $regex: name, $options: "i" } },
          { design: { $regex: code, $options: "i" } },
          { _id: { $regex: barcode, $options: "i" } },
        ],
      });

      res.status(200).json(product);
    } else {
      const product = await Product.find({
        $and: [
          { stock: isStock === "true" ? { $gt: 0 } : { $gte: 0 } },
          { price: price === "" ? { $gte: 0 } : +price },
          { name: { $regex: name, $options: "i" } },
          { _id: { $regex: barcode, $options: "i" } },
        ],
      });

      res.status(200).json(product);
    }
  } catch (error) {
    console.log(error);
  }
};

export const stockIn = async (req, res) => {
  console.log(req.body);
  try {
    const addProduct = req.body.map(
      async (item) =>
        await Product.findByIdAndUpdate(
          item._id,
          { $inc: { stock: item.importqty } },
          { new: true }
        )
    );
    await Promise.all(addProduct);
    const transfer = await Transfer.create({
      _id: Date.now(),
      from: "Khwanta",
      to: "ห้องสต๊อคศูนย์การเรียนรู้ขวัญตา",
      product: req.body.map((item) => ({
        barcode: item._id,
        qty: item.importqty,
      })),
      status: "success",
      type: "manufacture",
    });
    try {
      console.log(transfer);
      const { data } = await axios.post(`${process.env.URL}/stockin`, transfer);
      await Transfer.findByIdAndUpdate(transfer._id, {
        online: true,
      });
      res.status(200).json("success");
    } catch (error) {
      res.status(200).json("success");
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const GetStore = async (req, res) => {
  try {
    const stores = await Store.find();
    const selectStore = stores.filter(
      (item) => item.closeDate === null || new Date(item.closeDate) > new Date()
    );

    res.status(200).json({ stores: selectStore });
  } catch (error) {}
};
export const exportStock = async (req, res) => {
  const { store, products, id } = req.body;
  const Id = new Date();
  const idtext = `${Id.getFullYear().toString().slice(-2)}${
    Id.getMonth() + 1
  }${Id.getDate()}${Id.getHours()}${Id.getMinutes()}${Id.getSeconds()}`;

  const SettingData = await Setting.findOne();
  const FromID = await Store.findOne({ name: SettingData.warehouseName });
  const ToID = await Store.findOne({ name: store });
  try {
    const transfer = await Transfer.create({
      _id: `${FromID.storeRandomId}-${ToID.storeRandomId}-${idtext}`,
      from: SettingData.warehouseName,
      to: store,
      product: products.map((item) => ({
        barcode: item._id,
        qty: item.qty,
      })),
      status: "transport",
      type: "transfer",
    });
    if (transfer) {
      const updateProduct = products.map(
        async (item) =>
          await Product.findByIdAndUpdate(item._id, {
            $inc: { stock: -item.qty },
          })
      );
      await Promise.all(updateProduct);
    }
    try {
      console.log(transfer, "transfer");
      const { data } = await axios.post(
        `${process.env.URL}/transfer`,
        transfer
      );
      await Transfer.findByIdAndUpdate(transfer._id, {
        online: true,
      });
      if (id !== "new") {
        await DraftTransfer.findByIdAndDelete(id);
      }
      res.status(200).json("success");
    } catch (error) {
      if (id !== "new") {
        await DraftTransfer.findByIdAndDelete(id);
      }
      res.status(200).json("success");
    }
  } catch (error) {
    console.log(error);
    await Transfer.findByIdAndDelete(Id);
    res.status(400).json({ message: error.message });
  }
};

export const saveExportStock = async (req, res) => {
  console.log(req.body);
  const { store, products, id } = req.body;
  try {
    if (id !== "new") {
      const transfer = await DraftTransfer.findByIdAndUpdate(id, {
        to: store,
        product: products.map((item) => ({
          barcode: item._id,
          qty: item.qty,
        })),
      });
      return res.status(200).json("success");
    }
    const SettingData = await Setting.findOne();

    const transfer = await DraftTransfer.create({
      _id: Date.now(),
      from: SettingData.warehouseName,
      to: store,
      product: products.map((item) => ({
        barcode: item._id,
        qty: item.qty,
      })),
      type: "export",
    });

    res.status(200).json("success");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const exportList = async (req, res) => {
  try {
    const SettingData = await Setting.findOne();
    const Drafttransfer = await DraftTransfer.find({});
    const transfer = await Transfer.find({ status: { $ne: "cancel" } });
    res.status(200).json([...Drafttransfer, ...transfer]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteExport = async (req, res, next) => {
  const { id } = req.body;
  try {
    const transfer = await Transfer.findById(id);
    if (!transfer) {
      await DraftTransfer.findByIdAndDelete(id);
      return next();
    }
    const promise = transfer.product.map(async (item) => {
      await Product.findByIdAndUpdate(item.barcode, {
        $inc: { stock: item.qty },
      });
    });
    Promise.all(promise).then(async () => {
      await Transfer.findByIdAndUpdate(id, { status: "cancel" });
      const { data } = await axios.put(`${process.env.URL}/transfer`, {
        id: id,
        status: "cancel",
      });
      next();
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const fetchExportById = async (req, res) => {
  const { id } = req.params;
  try {
    const transfer = await DraftTransfer.findById(id);
    res.status(200).json(transfer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getPrintData = async (req, res) => {
  const { id } = req.params;

  try {
    const SettingData = await Setting.findOne();
    const transfer = await Transfer.findById(id);
    const Date = `${transfer.createAt.getDate()}/${
      transfer.createAt.getMonth() + 1
    }/${transfer.createAt.getFullYear()}`;
    const from = await Store.findOne({ name: transfer.from });
    const to = await Store.findOne({ name: transfer.to });
    const productData = await Product.find({
      _id: { $in: transfer.product.map((item) => item.barcode) },
    });
    const product = productData.map((item, i) => ({
      no: i + 1,
      name: item.name,
      barcode: item._id,
      qty: transfer.product.find((i) => i.barcode === item._id).qty,
      price: item.price,
      size: item.size ? item.size : "-",
      code: item.design ? item.design : "-",
      total:
        item.price * transfer.product.find((i) => i.barcode === item._id).qty,
    }));
    const QtyTotal = product.reduce((a, b) => a + b.qty, 0);
    const PriceTotal = product.reduce((a, b) => a + b.total, 0);
    const printdata = {
      from: from.name,
      fromAddress: from.address,
      to: to.name,
      toAddress: to.address,
      product: product,
      QtyTotal: QtyTotal,
      PriceTotal: PriceTotal,
      transferId: transfer._id,
      Date: Date,
      Printer: SettingData.PrinterName,
    };
    res.status(200).json(printdata);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};
