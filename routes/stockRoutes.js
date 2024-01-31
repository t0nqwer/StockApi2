import express from "express";
import {
  deleteExport,
  exportList,
  exportStock,
  fetchExportById,
  getPrintData,
  getProducts,
  saveExportStock,
  stockIn,
} from "../controllers/stock.js";
const router = express.Router();

router.route("/").get(getProducts).post(stockIn);
router.route("/export").post(exportStock).get(exportList);
router.route("/export/:id").get(fetchExportById);
router.route("/export/save").post(saveExportStock);
router.route("/export/delete").post(deleteExport, exportList);
router.get("/PrintExport/:id", getPrintData);

router.route("/import").post();
export default router;
