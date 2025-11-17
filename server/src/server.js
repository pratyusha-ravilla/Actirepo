import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ---------- FIXED CORS CONFIGURATION (ALLOW CLIENT 5173) ----------
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ---------- Middleware ----------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- Serve uploads folder ----------
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// ---------- Connect database ----------
connectDB();

// ---------- Routes ----------
import authRoutes from "./routes/authRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/activity", activityRoutes);

// ---------- Test Route ----------
app.get("/", (req, res) => {
  res.send("Server is running with CORS enabled");
});

// ---------- Start Server ----------
app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
