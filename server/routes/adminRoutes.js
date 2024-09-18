import express from "express";
import { authenticateUser, isAdmin } from "../middleware/authMiddleware.js";
import {
  createUser,
  manageStock,
  buyStockForClient,
  sellStockForClient,
} from "../controllers/adminController.js";

const router = express.Router();

// Admin actions
router.post("/create-user", authenticateUser, isAdmin, createUser);
router.post("/manage-stock", authenticateUser, isAdmin, manageStock);
router.post("/buy-stock", authenticateUser, isAdmin, buyStockForClient);
router.post("/sell-stock", authenticateUser, isAdmin, sellStockForClient);

export default router;
