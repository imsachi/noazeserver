import express from "express";
import { calculateBill } from "../controllers/storeController.js";

const router = express.Router();
router.post("/billing/calculate", calculateBill);

export default router;
