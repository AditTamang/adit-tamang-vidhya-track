import pool from "../config/dbConnection.js";

// Request parent-student link
export const requestParentStudentLinkService = async (
  parent_id,
  student_id
) => {
  const result = await pool.query(
    `INSERT INTO parent_student_link (parent_id, student_id)
     VALUES ($1, $2) RETURNING *`,
    [parent_id, student_id]
  );
  return result.rows[0];
};

// Approve/Reject parent-student link
export const updateParentStudentLinkService = async (
  link_id,
  status,
  approved_by
) => {
  const result = await pool.query(
    `UPDATE parent_student_link
     SET status=$1, approved_at=NOW(), approved_by=$2
     WHERE id=$3 RETURNING *`,
    [status, approved_by, link_id]
  );
  return result.rows[0];
};

// Get all pending links
export const getPendingLinksService = async () => {
  const result = await pool.query(
    `SELECT * FROM parent_student_link WHERE status='pending' ORDER BY requested_at DESC`
  );
  return result.rows;
};
