import express from "express";
import pool from "../config/dbConnection.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ==========================================
// SCHEDULE ROUTES
// ==========================================

// Get schedule for a student (based on their class)
router.get("/student/:studentId", authenticate, async (req, res) => {
    try {
        const { studentId } = req.params;

        // For now, return all schedules (can be filtered by class later)
        const result = await pool.query(
            `SELECT s.*, c.name as class_name 
             FROM schedules s 
             LEFT JOIN classes c ON s.class_id = c.id 
             ORDER BY s.event_date ASC, s.start_time ASC`
        );
        res.json({ status: 200, data: result.rows });
    } catch (error) {
        console.error("Error fetching schedule:", error);
        res.status(500).json({ status: 500, message: "Server error" });
    }
});

// Get all schedules (for admin/teacher)
router.get("/", authenticate, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT s.*, c.name as class_name, u.name as created_by_name 
             FROM schedules s 
             LEFT JOIN classes c ON s.class_id = c.id 
             LEFT JOIN users u ON s.created_by = u.id 
             ORDER BY s.event_date ASC`
        );
        res.json({ status: 200, data: result.rows });
    } catch (error) {
        console.error("Error fetching schedules:", error);
        res.status(500).json({ status: 500, message: "Server error" });
    }
});

// Create a schedule event
router.post("/", authenticate, async (req, res) => {
    try {
        const { title, description, event_date, start_time, end_time, class_id, status } = req.body;
        const createdBy = req.user.id;

        const result = await pool.query(
            `INSERT INTO schedules (title, description, event_date, start_time, end_time, class_id, status, created_by) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [title, description, event_date, start_time, end_time, class_id || null, status || 'upcoming', createdBy]
        );
        res.status(201).json({ status: 201, message: "Event created", data: result.rows[0] });
    } catch (error) {
        console.error("Error creating schedule:", error);
        res.status(500).json({ status: 500, message: "Server error" });
    }
});

// Update a schedule event
router.put("/:id", authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, event_date, start_time, end_time, class_id, status } = req.body;

        const result = await pool.query(
            `UPDATE schedules SET title = $1, description = $2, event_date = $3, start_time = $4, 
             end_time = $5, class_id = $6, status = $7 WHERE id = $8 RETURNING *`,
            [title, description, event_date, start_time, end_time, class_id, status, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ status: 404, message: "Event not found" });
        }
        res.json({ status: 200, message: "Event updated", data: result.rows[0] });
    } catch (error) {
        console.error("Error updating schedule:", error);
        res.status(500).json({ status: 500, message: "Server error" });
    }
});

// Delete a schedule event
router.delete("/:id", authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "DELETE FROM schedules WHERE id = $1 RETURNING id",
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ status: 404, message: "Event not found" });
        }
        res.json({ status: 200, message: "Event deleted" });
    } catch (error) {
        console.error("Error deleting schedule:", error);
        res.status(500).json({ status: 500, message: "Server error" });
    }
});

export default router;
