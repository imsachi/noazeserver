import express from "express";
import {
  calculateBill,
  checkingDelivery,
  checkingPincode,
} from "../controllers/storeController.js";

const router = express.Router();
router.post("/billing/calculate", calculateBill);
router.get("/check-pincode", checkingPincode);
router.get("/check-delivery", checkingDelivery);

export default router;
