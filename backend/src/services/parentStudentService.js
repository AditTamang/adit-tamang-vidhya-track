import pool from "../config/dbConnection.js";

// Request link
export const requestLinkService = async (parentId, studentId) => {
  // Validate student exists
  const studentCheck = await pool.query(
    `SELECT * FROM students WHERE id = $1`,
    [studentId]
  );
  if (studentCheck.rowCount === 0) {
    throw new Error("Student not found");
  }

  // Validate parent exists
  const parentCheck = await pool.query(
    `SELECT * FROM parents WHERE user_id = $1`,
    [parentId]
  );
  if (parentCheck.rowCount === 0) {
    throw new Error("Parent not found");
  }

  // Check duplicate pending request
  const duplicate = await pool.query(
    `SELECT * FROM parent_student_link 
     WHERE parent_id = $1 AND student_id = $2 AND status = 'pending'`,
    [parentId, studentId]
  );

  if (duplicate.rowCount > 0) {
    throw new Error("Link request already sent");
  }

  // Insert request
  const result = await pool.query(
    `INSERT INTO parent_student_link (parent_id, student_id)
     VALUES ($1, $2)
     RETURNING *`,
    [parentId, studentId]
  );

  return result.rows[0];
};

// Approve request
export const approveLinkService = async (parentId, studentId, adminId) => {
  // Check request exists
  const check = await pool.query(
    `SELECT * FROM parent_student_link
     WHERE parent_id = $1 AND student_id = $2 AND status = 'pending'`,
    [parentId, studentId]
  );

  if (check.rowCount === 0) {
    throw new Error("Link request not found");
  }

  const result = await pool.query(
    `UPDATE parent_student_link 
     SET status='approved', approved_by=$1, approved_at=NOW()
     WHERE parent_id=$2 AND student_id=$3
     RETURNING *`,
    [adminId, parentId, studentId]
  );

  return result.rows[0];
};

// List linked students
export const getLinkedStudentsService = async (parentId) => {
  const result = await pool.query(
    `SELECT 
        s.id AS student_id,
        u.name AS student_name,
        s.student_code,
        s.class,
        s.section
     FROM parent_student_link psl
     JOIN students s ON s.id = psl.student_id
     JOIN users u ON u.id = s.user_id
     WHERE psl.parent_id = $1 AND psl.status='approved'
     ORDER BY s.id DESC`,
    [parentId]
  );

  return result.rows;
};
