import express from "express";
import pool from "../config/dbConnection.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ==========================================
// CLASSES ROUTES
// ==========================================

// Get all classes
router.get("/classes", authenticate, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM classes ORDER BY name"
        );
        res.json({ status: 200, data: result.rows });
    } catch (error) {
        console.error("Error fetching classes:", error);
        res.status(500).json({ status: 500, message: "Server error" });
    }
});

// Create a class
router.post("/classes", authenticate, async (req, res) => {
    try {
        const { name, description } = req.body;

        // Check for duplicate class name
        const existing = await pool.query(
            "SELECT id FROM classes WHERE LOWER(name) = LOWER($1)",
            [name]
        );
        if (existing.rows.length > 0) {
            return res.status(400).json({ status: 400, message: "Class with this name already exists" });
        }

        const result = await pool.query(
            "INSERT INTO classes (name, description) VALUES ($1, $2) RETURNING *",
            [name, description]
        );
        res.status(201).json({ status: 201, message: "Class created", data: result.rows[0] });
    } catch (error) {
        console.error("Error creating class:", error);
        res.status(500).json({ status: 500, message: "Server error" });
    }
});

// Update a class
router.put("/classes/:id", authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const result = await pool.query(
            "UPDATE classes SET name = $1, description = $2, updated_at = NOW() WHERE id = $3 RETURNING *",
            [name, description, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ status: 404, message: "Class not found" });
        }
        res.json({ status: 200, message: "Class updated", data: result.rows[0] });
    } catch (error) {
        console.error("Error updating class:", error);
        res.status(500).json({ status: 500, message: "Server error" });
    }
});

// Delete a class
router.delete("/classes/:id", authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "DELETE FROM classes WHERE id = $1 RETURNING id",
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ status: 404, message: "Class not found" });
        }
        res.json({ status: 200, message: "Class deleted" });
    } catch (error) {
        console.error("Error deleting class:", error);
        res.status(500).json({ status: 500, message: "Server error" });
    }
});

// Get sections for a class
router.get("/classes/:classId/sections", authenticate, async (req, res) => {
    try {
        const { classId } = req.params;
        const result = await pool.query(
            `SELECT s.*, u.name as teacher_name 
             FROM sections s 
             LEFT JOIN users u ON s.teacher_id = u.id 
             WHERE s.class_id = $1 
             ORDER BY s.name`,
            [classId]
        );
        res.json({ status: 200, data: result.rows });
    } catch (error) {
        console.error("Error fetching sections:", error);
        res.status(500).json({ status: 500, message: "Server error" });
    }
});

// ==========================================
// SECTIONS ROUTES
// ==========================================

// Create a section
router.post("/sections", authenticate, async (req, res) => {
    try {
        const { name, class_id, teacher_id } = req.body;

        // Check for duplicate section name in the same class
        const existing = await pool.query(
            "SELECT id FROM sections WHERE LOWER(name) = LOWER($1) AND class_id = $2",
            [name, class_id]
        );
        if (existing.rows.length > 0) {
            return res.status(400).json({ status: 400, message: "Section with this name already exists in this class" });
        }

        const result = await pool.query(
            "INSERT INTO sections (name, class_id, teacher_id) VALUES ($1, $2, $3) RETURNING *",
            [name, class_id, teacher_id || null]
        );
        res.status(201).json({ status: 201, message: "Section created", data: result.rows[0] });
    } catch (error) {
        console.error("Error creating section:", error);
        res.status(500).json({ status: 500, message: "Server error" });
    }
});

// Update a section
router.put("/sections/:id", authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, teacher_id } = req.body;
        const result = await pool.query(
            "UPDATE sections SET name = $1, teacher_id = $2, updated_at = NOW() WHERE id = $3 RETURNING *",
            [name, teacher_id || null, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ status: 404, message: "Section not found" });
        }
        res.json({ status: 200, message: "Section updated", data: result.rows[0] });
    } catch (error) {
        console.error("Error updating section:", error);
        res.status(500).json({ status: 500, message: "Server error" });
    }
});

// Delete a section
router.delete("/sections/:id", authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "DELETE FROM sections WHERE id = $1 RETURNING id",
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ status: 404, message: "Section not found" });
        }
        res.json({ status: 200, message: "Section deleted" });
    } catch (error) {
        console.error("Error deleting section:", error);
        res.status(500).json({ status: 500, message: "Server error" });
    }
});

export default router;
