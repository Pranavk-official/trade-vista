import express from "express";
import { adminLogin, registerAdmin } from "../controllers/authController.js";

const router = express.Router();

// Admin Registration & Login
router.post("/admin/register", registerAdmin);
router.post("/admin/login", adminLogin);

export default router;
