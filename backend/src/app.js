import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { networkInterfaces } from "os";
import pool from "./config/dbConnection.js";
import errorHandler from "./middlewares/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import parentStudentRoutes from "./routes/parentStudentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import gradeRoutes from "./routes/gradeRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import academicYearRoutes from "./routes/academicYearRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";

dotenv.config();

const app = express();

// Function to get local IP address
function getLocalIP() {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "localhost";
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS - allow all origins for mobile app development
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Testing the PostgreSQL connection
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT current_database()");
    res.send(`The database name is : ${result.rows[0].current_database}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Database connection failed");
  }
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/parent-student", parentStudentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", classRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/academic-years", academicYearRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/student", studentRoutes);

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
  const ip = getLocalIP();
  console.log(`Server running on port ${port}`);
  console.log(`Mobile app can connect to: http://${ip}:${port}`);
});

export default app;
