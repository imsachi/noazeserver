import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
// protected
router.get("/me", protect, getProfile);

export default router;
