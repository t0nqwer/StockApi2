import axios from "axios";
import Product from "../models/product.js";
import Transfer from "../models/transfer.js";
import pkg from "node-schedule";
const { scheduleJob } = pkg;

const checkOnline = async () => {
  console.log("helloworld: checking online");
  for (let i = 0; ; i++) {
    const NotOnline = await Transfer.findOne({ online: false });
    if (NotOnline) {
      const response = await axios.post(
        `${process.env.URL}/stockIn`,
        NotOnline
      );
      if (response.status === 200) {
        await Transfer.findByIdAndUpdate(NotOnline._id, {
          online: true,
        });
      }
    } else {
      break;
    }
  }
};

scheduleJob("*/5 * * * *", async function () {
  await checkOnline();
});
