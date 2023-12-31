import axios from "axios";
import Product from "../models/product.js";
import Transfer from "../models/transfer.js";
import pkg from "node-schedule";
const { scheduleJob } = pkg;

const checkOnline = async () => {
  console.log("helloworld: checking online");
  for (let i = 0; ; i++) {
    const NotOnline = await Transfer.findOne({
      online: false,
      status: { $ne: "cancel" },
    });
    if (NotOnline) {
      if (NotOnline.type === "manufacture") {
        try {
          const response = await axios.post(
            `${process.env.URL}/stockIn`,
            NotOnline
          );
          await Transfer.findByIdAndUpdate(NotOnline._id, {
            online: true,
          });
        } catch (error) {
          break;
        }
      }
      if (NotOnline.type === "transfer") {
        try {
          const response = await axios.post(
            `${process.env.URL}/transfer`,
            NotOnline
          );
          await Transfer.findByIdAndUpdate(NotOnline._id, {
            online: true,
          });
        } catch (error) {
          break;
        }
      }
    } else {
      break;
    }
  }
};

scheduleJob("*/5 * * * *", async function () {
  await checkOnline();
});
