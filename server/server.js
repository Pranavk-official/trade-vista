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

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "https://trade-vista-plum.vercel.app",
  }),
);

// Initialize Passport
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/client", clientRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
