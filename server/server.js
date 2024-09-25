import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import passport from "passport";
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import "./config/auth.js"; // Import passport config
import cors from "cors";
import cron from "node-cron";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: ["https://trade-vista-plum.vercel.app", "http://localhost:5173"],
  }),
);

// Initialize Passport
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/client", clientRoutes);

// Route for pinging the server
app.get("/ping", (req, res) => {
  console.log("Server pinged at:", new Date().toISOString());
  res.status(200).send("Pong!");
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Cron Job to ping the server every 60 seconds
const pingServer = () => {
  console.log("Performing scheduled ping at:", new Date().toISOString());
};

// Schedule the cron job to run every 8 minutes
cron.schedule("*/2 * * * *", pingServer);

console.log("Cron job scheduled to ping server every 60 seconds");
