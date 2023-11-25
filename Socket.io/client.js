import { io } from "socket.io-client";
const Url = "http://localhost:7070";
import { ServerSocket } from "./server.js";
import { DeleteProduct, NewProduct, PriceChange } from "./socketAction.js";
import axios from "axios";
const url2 = "http://192.168.0.252:7070";
import Setting from "../models/setting.js";

export const socket = io(url2, {}).connect();

socket.on("connect", async () => {
  const setting = await Setting.findOne();
  socket.emit("connectname", setting.warehouseName);
});

socket.on("newProduct", (data) => {
  console.log(data, "newProduct");
  NewProduct(data);
  data.map((item) => {
    ServerSocket.emit("notification", `รหัสสินค้าใหม่ ${item._id}`);
  });
});
socket.on("priceChange", (data) => {
  console.log(data, "priceChange");
  PriceChange(data);
  ServerSocket.emit(
    "notification",
    `ราคาของรหัส ${data.barcode} เปลี่ยนเป็น ${data.price} บาท`
  );
});
socket.on("deleteProduct", (data) => {
  console.log(data, "deleteProduct");
  DeleteProduct(data);
  ServerSocket.emit("notification", `รหัสสินค้า ${data} ถูกลบ`);
});
