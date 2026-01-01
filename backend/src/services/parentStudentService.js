import pool from "../config/dbConnection.js";

// Request link by Student Code
export const requestLinkByCodeService = async (parentId, studentCode) => {
  // Find student by code
  const student = await pool.query(
    `SELECT id, user_id FROM students WHERE student_code = $1`,
    [studentCode]
  );

  if (student.rowCount === 0) {
    throw new Error("Invalid Student Code. Please check and try again.");
  }

  const studentId = student.rows[0].id; // Use students.id, not user_id

  // Reuse existing link service
  return await requestLinkService(parentId, studentId);
};

// Request link (ID based - expects students.id)
export const requestLinkService = async (parentUserId, studentId) => {
  // Check duplicate request
  const duplicate = await pool.query(
    `SELECT * FROM parent_student_link 
     WHERE parent_id = $1 AND student_id = $2`,
    [parentUserId, studentId]
  );

  if (duplicate.rowCount > 0) {
    const status = duplicate.rows[0].status;
    if (status === 'approved') {
      throw new Error("You are already linked to this student");
    }
    throw new Error("Link request already sent");
  }

  // Insert request
  const result = await pool.query(
    `INSERT INTO parent_student_link (parent_id, student_id, status, requested_at)
     VALUES ($1, $2, 'pending', NOW())
     RETURNING *`,
    [parentUserId, studentId]
  );

  return result.rows[0];
};

// Approve request (called by admin)
export const approveLinkService = async (parentId, studentId, adminId) => {
  const result = await pool.query(
    `UPDATE parent_student_link 
     SET status='approved', approved_by=$1, approved_at=NOW()
     WHERE parent_id=$2 AND student_id=$3 AND status='pending'
     RETURNING *`,
    [adminId, parentId, studentId]
  );

  if (result.rowCount === 0) {
    throw new Error("Link request not found");
  }

  return result.rows[0];
};

// List linked students for a parent
export const getLinkedStudentsService = async (parentUserId) => {
  const result = await pool.query(
    `SELECT 
        s.id AS id,
        u.name AS name,
        u.email AS email,
        s.student_code,
        s.class AS class_name,
        s.section,
        psl.status
     FROM parent_student_link psl
     JOIN students s ON s.id = psl.student_id
     JOIN users u ON u.id = s.user_id
     WHERE psl.parent_id = $1 AND psl.status = 'approved'
     ORDER BY s.id DESC`,
    [parentUserId]
  );

  return result.rows;
};
