import express from "express";
import {
  adminLogin,
  registerAdmin,
  clientLogin,
} from "../controllers/authController.js";

const router = express.Router();

// Admin Registration & Login
router.post("/admin/register", registerAdmin);
router.post("/admin/login", adminLogin);

// Client Login
router.post("/login", clientLogin);

export default router;
