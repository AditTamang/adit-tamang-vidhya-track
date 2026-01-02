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

// Get all users (with pagination)
router.get("/users", authenticate, isAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { getAllUsersService } = await import("../services/userService.js");
    const { users, total } = await getAllUsersService(limit, offset);

    res.json({ 
        status: 200, 
        data: {
            users,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        } 
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ status: 500, message: "Server error" });
  }
});

// Get dashboard stats
router.get("/stats", authenticate, isAdmin, async (req, res) => {
    try {
        const { getDashboardStatsService } = await import("../services/userService.js");
        const stats = await getDashboardStatsService();
        res.json({ status: 200, data: stats });
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ status: 500, message: "Server error" });
    }
});

// Update user role
router.put("/update-role/:id", authenticate, isAdmin, async (req, res) => {
    try {
        const userId = req.params.id;
        const { role } = req.body;

        if (!role || !['student', 'teacher', 'parent'].includes(role)) {
            return res.status(400).json({ status: 400, message: "Invalid role" });
        }

        const result = await pool.query(
            "UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role",
            [role, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }

        res.json({ status: 200, message: "Role updated successfully", data: result.rows[0] });
    } catch (error) {
        console.error("Error updating role:", error);
        res.status(500).json({ status: 500, message: "Server error" });
    }
});

// Get pending parent-student link requests
router.get("/parent-student-links", authenticate, isAdmin, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                psl.id,
                psl.parent_id,
                psl.student_id,
                psl.status,
                psl.requested_at as created_at,
                pu.name as parent_name,
                pu.email as parent_email,
                su.name as student_name,
                su.email as student_email,
                s.student_code,
                s.class,
                s.section
            FROM parent_student_link psl
            JOIN users pu ON pu.id = psl.parent_id
            JOIN students s ON s.id = psl.student_id
            JOIN users su ON su.id = s.user_id
            WHERE psl.status = 'pending'
            ORDER BY psl.requested_at DESC`
        );
        res.json({ status: 200, data: result.rows });
    } catch (error) {
        console.error("Error fetching parent-student links:", error);
        res.status(500).json({ status: 500, message: "Server error" });
    }
});

// Approve parent-student link
router.post("/approve-link/:id", authenticate, isAdmin, async (req, res) => {
    try {
        const linkId = req.params.id;
        const adminId = req.user.id;

        const result = await pool.query(
            `UPDATE parent_student_link 
             SET status = 'approved', approved_by = $1, approved_at = NOW()
             WHERE id = $2 AND status = 'pending'
             RETURNING *`,
            [adminId, linkId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ status: 404, message: "Link request not found" });
        }

        res.json({ status: 200, message: "Link approved successfully", data: result.rows[0] });
    } catch (error) {
        console.error("Error approving link:", error);
        res.status(500).json({ status: 500, message: "Server error" });
    }
});

// Reject parent-student link
router.post("/reject-link/:id", authenticate, isAdmin, async (req, res) => {
    try {
        const linkId = req.params.id;

        const result = await pool.query(
            `UPDATE parent_student_link 
             SET status = 'rejected' 
             WHERE id = $1 AND status = 'pending'
             RETURNING *`,
            [linkId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ status: 404, message: "Link request not found" });
        }

        res.json({ status: 200, message: "Link rejected successfully" });
    } catch (error) {
        console.error("Error rejecting link:", error);
        res.status(500).json({ status: 500, message: "Server error" });
    }
});
// Get classes and sections for assignment
router.get("/classes-sections", authenticate, isAdmin, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                c.id as class_id, 
                c.name as class_name, 
                s.id as section_id, 
                s.name as section_name,
                s.teacher_id,
                u.name as current_teacher_name
            FROM classes c
            JOIN sections s ON s.class_id = c.id
            LEFT JOIN users u ON u.id = s.teacher_id
            ORDER BY c.id, s.name
        `);
        
        // Group by class
        const classesMap = new Map();
        result.rows.forEach(row => {
            if (!classesMap.has(row.class_id)) {
                classesMap.set(row.class_id, {
                    id: row.class_id,
                    name: row.class_name,
                    sections: []
                });
            }
            classesMap.get(row.class_id).sections.push({
                id: row.section_id,
                name: row.section_name,
                teacherId: row.teacher_id,
                teacherName: row.current_teacher_name
            });
        });

        res.json({ status: 200, data: Array.from(classesMap.values()) });
    } catch (error) {
        console.error("Error fetching classes:", error);
        res.status(500).json({ status: 500, message: "Server error" });
    }
});

// Update teacher's class assignments (Bulk)
router.post("/update-teacher-classes", authenticate, isAdmin, async (req, res) => {
    const client = await pool.connect();
    try {
        const { teacherId, sectionIds } = req.body;

        if (!teacherId || !Array.isArray(sectionIds)) {
             return res.status(400).json({ status: 400, message: "Invalid parameters" });
        }

        await client.query('BEGIN');

        // 1. Remove teacher from all sections they currently teach
        // This ensures if they are unchecked in UI, they are removed.
        await client.query("UPDATE sections SET teacher_id = NULL WHERE teacher_id = $1", [teacherId]);

        // 2. Assign teacher to the selected sections
        if (sectionIds.length > 0) {
            await client.query(
                "UPDATE sections SET teacher_id = $1 WHERE id = ANY($2::int[])",
                [teacherId, sectionIds]
            );
        }

        await client.query('COMMIT');
        res.json({ status: 200, message: "Class assignments updated successfully" });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error updating teacher classes:", error);
        res.status(500).json({ status: 500, message: "Server error" });
    } finally {
        client.release();
    }
});

// ==========================================
// USER STATUS MANAGEMENT
// ==========================================

// Toggle user active status (activate/deactivate)
router.patch("/toggle-status/:id", authenticate, isAdmin, async (req, res) => {
    try {
        const userId = req.params.id;
        const adminId = req.user.id;

        // Get current status
        const userResult = await pool.query(
            "SELECT id, name, is_active, role FROM users WHERE id = $1",
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }

        const user = userResult.rows[0];

        // Don't allow deactivating admins
        if (user.role === 'admin') {
            return res.status(400).json({ status: 400, message: "Cannot deactivate admin accounts" });
        }

        // Toggle the status
        const newStatus = !user.is_active;
        const result = await pool.query(
            "UPDATE users SET is_active = $1, updated_at = NOW() WHERE id = $2 RETURNING id, name, email, is_active",
            [newStatus, userId]
        );

        // Log the action
        await pool.query(
            `INSERT INTO audit_logs (admin_id, action, target_type, target_id, details)
             VALUES ($1, $2, 'user', $3, $4)`,
            [adminId, newStatus ? 'ACTIVATE_USER' : 'DEACTIVATE_USER', userId, JSON.stringify({ userName: user.name })]
        );

        res.json({
            status: 200,
            message: newStatus ? "User activated successfully" : "User deactivated successfully",
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Error toggling user status:", error);
        res.status(500).json({ status: 500, message: "Server error" });
    }
});

// ==========================================
// AUDIT LOGS
// ==========================================

// Get audit logs (with pagination)
router.get("/audit-logs", authenticate, isAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const result = await pool.query(
            `SELECT 
                al.id,
                al.action,
                al.target_type,
                al.target_id,
                al.details,
                al.created_at,
                u.name as admin_name
             FROM audit_logs al
             LEFT JOIN users u ON u.id = al.admin_id
             ORDER BY al.created_at DESC
             LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        const countResult = await pool.query("SELECT COUNT(*) FROM audit_logs");
        const total = parseInt(countResult.rows[0].count);

        res.json({
            status: 200,
            data: {
                logs: result.rows,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error("Error fetching audit logs:", error);
        res.status(500).json({ status: 500, message: "Server error" });
    }
});

export default router;
