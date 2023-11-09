import express from "express";
import {
  exportList,
  exportStock,
  getProducts,
  saveExportStock,
  stockIn,
} from "../controllers/stock.js";
const router = express.Router();

router.route("/").get(getProducts).post(stockIn);
router.route("/export").post(exportStock).get(exportList);
router.route("/export/:id").get();
router.route("/export/save").post(saveExportStock);

router.route("/import").post();
export default router;
