import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { viewDashboard, addFunds } from "../controllers/clientController.js";

const router = express.Router();

// Client actions
router.get("/dashboard", authenticateUser, viewDashboard);
router.post("/add-funds", authenticateUser, addFunds);

export default router;
