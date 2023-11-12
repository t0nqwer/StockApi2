import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectToDatabase } from "./function/database.js";
import startServer from "./function/startServer.js";
import stockRoutes from "./routes/stockRoutes.js";
import settingRoutes from "./routes/settingRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";
import "./function/CheckOnline.js";
dotenv.config();
startServer();
const app = express();

app.use(express.json());
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/stock", stockRoutes);
app.use("/setting", settingRoutes);
app.use("/store", storeRoutes);
const date = new Date();

console.log(
  date.getDate(),
  date.getMonth() + 1,
  date.getFullYear(),
  date.getHours(),
  date.getMinutes(),
  date.getSeconds(),
  date.getMilliseconds(),
  Date.now(),
  performance.now(),
  performance.now()
);
connectToDatabase();
const port = parseInt(process.env.PORT) || 8585;
app.listen(port, () => {
  console.log(`helloworld: listening on http://localhost:${port}`);
});
