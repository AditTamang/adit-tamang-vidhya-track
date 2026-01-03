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

// Get all academic years
router.get("/", authenticate, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM academic_years ORDER BY start_date DESC"
        );
        res.json({ status: 200, data: result.rows });
    } catch (error) {
        console.error("Error fetching academic years:", error);
        res.status(500).json({ status: 500, message: "Server error" });
    }
});

// Get active academic year
router.get("/active", authenticate, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM academic_years WHERE is_active = TRUE LIMIT 1"
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ status: 404, message: "No active academic year" });
        }
        res.json({ status: 200, data: result.rows[0] });
    } catch (error) {
        console.error("Error fetching active academic year:", error);
        res.status(500).json({ status: 500, message: "Server error" });
    }
});

// Create new academic year (Admin only)
router.post("/", authenticate, isAdmin, async (req, res) => {
    try {
        const { name, start_date, end_date } = req.body;

        if (!name || !start_date || !end_date) {
            return res.status(400).json({ status: 400, message: "Name, start date and end date are required" });
        }

        // Check for duplicate name
        const existing = await pool.query(
            "SELECT id FROM academic_years WHERE name = $1",
            [name]
        );
        if (existing.rows.length > 0) {
            return res.status(400).json({ status: 400, message: "Academic year with this name already exists" });
        }

        const result = await pool.query(
            "INSERT INTO academic_years (name, start_date, end_date) VALUES ($1, $2, $3) RETURNING *",
            [name, start_date, end_date]
        );

        res.status(201).json({ status: 201, message: "Academic year created", data: result.rows[0] });
    } catch (error) {
        console.error("Error creating academic year:", error);
        res.status(500).json({ status: 500, message: "Server error" });
    }
});

// Update academic year (Admin only)
router.put("/:id", authenticate, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, start_date, end_date } = req.body;

        const result = await pool.query(
            "UPDATE academic_years SET name = $1, start_date = $2, end_date = $3 WHERE id = $4 RETURNING *",
            [name, start_date, end_date, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ status: 404, message: "Academic year not found" });
        }

        res.json({ status: 200, message: "Academic year updated", data: result.rows[0] });
    } catch (error) {
        console.error("Error updating academic year:", error);
        res.status(500).json({ status: 500, message: "Server error" });
    }
});

// Set academic year as active (Admin only)
router.patch("/:id/activate", authenticate, isAdmin, async (req, res) => {
    const client = await pool.connect();
    try {
        const { id } = req.params;

        await client.query('BEGIN');

        // Deactivate all years first
        await client.query("UPDATE academic_years SET is_active = FALSE");

        // Activate the selected year
        const result = await client.query(
            "UPDATE academic_years SET is_active = TRUE WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ status: 404, message: "Academic year not found" });
        }

        await client.query('COMMIT');
        res.json({ status: 200, message: "Academic year activated", data: result.rows[0] });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error activating academic year:", error);
        res.status(500).json({ status: 500, message: "Server error" });
    } finally {
        client.release();
    }
});

// Delete academic year (Admin only)
router.delete("/:id", authenticate, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        // Don't allow deleting active year
        const activeCheck = await pool.query(
            "SELECT is_active FROM academic_years WHERE id = $1",
            [id]
        );

        if (activeCheck.rows.length > 0 && activeCheck.rows[0].is_active) {
            return res.status(400).json({ status: 400, message: "Cannot delete active academic year" });
        }

        const result = await pool.query(
            "DELETE FROM academic_years WHERE id = $1 RETURNING id",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ status: 404, message: "Academic year not found" });
        }

        res.json({ status: 200, message: "Academic year deleted" });
    } catch (error) {
        console.error("Error deleting academic year:", error);
        res.status(500).json({ status: 500, message: "Server error" });
    }
});

export default router;
