import express from "express";
import {
  adminLogin,
  registerAdmin,
  clientLogin,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

// Admin Registration & Login
router.post("/admin/register", registerAdmin);
router.post("/admin/login", adminLogin);

// Client Login
router.post("/login", clientLogin);

// Forgot Password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
