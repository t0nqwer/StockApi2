import express from "express";
import { setBarcode, getSetting } from "../controllers/setting.js";

const router = express.Router();

router.route("/").get(getSetting).post(setBarcode);
export default router;
