import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getOrders, placeOrder } from "../controllers/orderController.js";

const router = express.Router();

router.post("/place", protect, placeOrder);
router.get("/my-orders", protect, getOrders);

export default router;
