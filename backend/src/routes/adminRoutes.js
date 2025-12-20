import express from "express";
import pool from "../config/dbConnection.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      "SELECT role FROM users WHERE id = $1",
      [userId]
    );
    if (result.rows.length === 0 || result.rows[0].role !== "admin") {
      return res.status(403).json({ status: 403, message: "Admin access required" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Server error" });
  }
};

// Get all pending users (not approved)
router.get("/pending-users", authenticate, isAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, role, phone_number, created_at 
       FROM users 
       WHERE is_approved = FALSE AND is_verified = TRUE AND role != 'admin'
       ORDER BY created_at DESC`
    );
    res.json({ status: 200, data: result.rows });
  } catch (error) {
    console.error("Error fetching pending users:", error);
    res.status(500).json({ status: 500, message: "Server error" });
  }
});

// Approve a user
router.post("/approve-user/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await pool.query(
      "UPDATE users SET is_approved = TRUE WHERE id = $1 RETURNING id, name, email",
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }
    res.json({ status: 200, message: "User approved", data: result.rows[0] });
  } catch (error) {
    console.error("Error approving user:", error);
    res.status(500).json({ status: 500, message: "Server error" });
  }
});

// Reject a user (delete them)
router.post("/reject-user/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 AND is_approved = FALSE RETURNING id",
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 404, message: "User not found or already approved" });
    }
    res.json({ status: 200, message: "User rejected and removed" });
  } catch (error) {
    console.error("Error rejecting user:", error);
    res.status(500).json({ status: 500, message: "Server error" });
  }
});

// Get all users (for admin management)
router.get("/users", authenticate, isAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, role, phone_number, is_verified, is_approved, created_at 
       FROM users 
       WHERE role != 'admin'
       ORDER BY created_at DESC`
    );
    res.json({ status: 200, data: result.rows });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ status: 500, message: "Server error" });
  }
});

export default router;

