// backend/server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// routes
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/product.js";
import cartRoutes from "./routes/cart.js";
import requestRoutes from "./routes/requests.js";
import userRoutes from "./routes/user.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// static uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// mount api routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/user", userRoutes);
app.get("/api/health", (req, res) => res.json({ ok: true }));


const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error("❌ MongoDB connection failed!");
    console.error("Error name:", err.name);
    console.error("Error code:", err.code);
    console.error("Error message:", err.message);
    console.error("Full error object:", err);
    console.error("Stack trace:\n", err.stack);
    process.exit(1);
  });
