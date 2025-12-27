import express from "express";
import pool from "../config/dbConnection.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ==========================================
// GRADES ROUTES
// ==========================================

// Get grades for a student (parent can view their linked student's grades)
router.get("/student/:studentId", authenticate, async (req, res) => {
    try {
        const { studentId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        // Check if user has permission to view this student's grades
        if (userRole === 'parent') {
            // Check if this student is linked to this parent
            const linkCheck = await pool.query(
                "SELECT * FROM parent_student_links WHERE parent_id = $1 AND student_id = $2 AND status = 'approved'",
                [userId, studentId]
            );
            if (linkCheck.rows.length === 0) {
                return res.status(403).json({ status: 403, message: "Not authorized to view this student's grades" });
            }
        } else if (userRole === 'student' && userId != studentId) {
            return res.status(403).json({ status: 403, message: "Can only view your own grades" });
        }

        const result = await pool.query(
            `SELECT * FROM grades WHERE student_id = $1 ORDER BY created_at DESC`,
            [studentId]
        );
        res.json({ status: 200, data: result.rows });
    } catch (error) {
        console.error("Error fetching grades:", error);
        res.status(500).json({ status: 500, message: "Server error" });
    }
});

// Add a grade (teacher only)
router.post("/", authenticate, async (req, res) => {
    try {
        const { student_id, subject, marks, total_marks, grade, exam_type, remarks } = req.body;
        const createdBy = req.user.id;

        const result = await pool.query(
            `INSERT INTO grades (student_id, subject, marks, total_marks, grade, exam_type, remarks, created_by) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [student_id, subject, marks, total_marks || 100, grade, exam_type || 'regular', remarks, createdBy]
        );
        res.status(201).json({ status: 201, message: "Grade added", data: result.rows[0] });
    } catch (error) {
        console.error("Error adding grade:", error);
        res.status(500).json({ status: 500, message: "Server error" });
    }
});

// Update a grade
router.put("/:id", authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { marks, total_marks, grade, remarks } = req.body;

        const result = await pool.query(
            `UPDATE grades SET marks = $1, total_marks = $2, grade = $3, remarks = $4 
             WHERE id = $5 RETURNING *`,
            [marks, total_marks, grade, remarks, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ status: 404, message: "Grade not found" });
        }
        res.json({ status: 200, message: "Grade updated", data: result.rows[0] });
    } catch (error) {
        console.error("Error updating grade:", error);
        res.status(500).json({ status: 500, message: "Server error" });
    }
});

// Delete a grade
router.delete("/:id", authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "DELETE FROM grades WHERE id = $1 RETURNING id",
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ status: 404, message: "Grade not found" });
        }
        res.json({ status: 200, message: "Grade deleted" });
    } catch (error) {
        console.error("Error deleting grade:", error);
        res.status(500).json({ status: 500, message: "Server error" });
    }
});

export default router;
