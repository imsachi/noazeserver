import express from "express";
import {
  calculateBill,
  checkingDelivery,
} from "../controllers/storeController.js";

const router = express.Router();
router.post("/billing/calculate", calculateBill);
router.get("/check-delivery", checkingDelivery);

export default router;
