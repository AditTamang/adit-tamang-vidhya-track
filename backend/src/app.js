import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./config/dbConnection.js";
import errorHandler from "./middlewares/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import parentStudentRoutes from "./routes/parentStudentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS - allow all origins for mobile app development
app.use(
  cors({
    origin: "*", // Allow all origins (mobile app needs this)
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//Testing the postgresql
app.get("/", async (req, res) => {
  console.log("Start");
  const result = await pool.query("SELECT current_database()");
  res.send(`The database name is : ${result.rows[0].current_database}`);
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/parent-student", parentStudentRoutes);
app.use("/api/admin", adminRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: "Route not found",
  });
});

// Error handling middleware
app.use(errorHandler);

const port = process.env.PORT || 3001;

// Listen on all network interfaces (0.0.0.0) for mobile app access
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
  console.log(`Mobile app can connect to: http://192.168.18.6:${port}`);
});

export default app;
