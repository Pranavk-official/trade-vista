import express from "express";
import { authenticateUser, isAdmin } from "../middleware/authMiddleware.js";
import {
  createUser,
  manageStock,
  viewAllStocks,
  viewAllClients,
  viewStockDetails,
  viewClientDetails,
  adminBuyStockForClient,
  adminSellStockForClient,
} from "../controllers/adminController.js";

const router = express.Router();

// Admin actions
router.post("/create-user", authenticateUser, isAdmin, createUser);
router.post("/manage-stock", authenticateUser, isAdmin, manageStock);
router.post("/buy-stock", authenticateUser, isAdmin, adminBuyStockForClient);
router.post("/sell-stock", authenticateUser, isAdmin, adminSellStockForClient);

// Admin Views
router.get("/clients", viewAllClients);
router.get("/clients/:clientId", viewClientDetails);
router.get("/stocks", viewAllStocks);
router.get("/stocks/:stockId", viewStockDetails);

export default router;
