import express from "express";
import { GetStore } from "../controllers/store.js";
const router = express.Router();

router.route("/").get(GetStore).post();
export default router;
