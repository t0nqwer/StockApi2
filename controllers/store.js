import Product from "../models/product.js";
import axios from "axios";
import Transfer from "../models/transfer.js";
import Store from "../models/store.js";

export const GetStore = async (req, res) => {
  try {
    const stores = await Store.find();
    const selectStore = stores.filter(
      (item) =>
        (item.closeDate === null &&
          item.name !== "ห้องสต๊อคศูนย์การเรียนรู้ขวัญตา") ||
        new Date(item.closeDate) > new Date()
    );

    res.status(200).json(selectStore);
  } catch (error) {}
};
