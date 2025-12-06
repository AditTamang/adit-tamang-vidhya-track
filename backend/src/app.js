import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./config/dbConnection.js";
import errorHandler from "./middlewares/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import profileRoutes from "./routes/profileRoutes.js";
import parentStudentRoutes from "./routes/parentStudentRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

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
app.listen(port, () => {
  console.log(`The port is running in the ${port}`);
});

export default app;
