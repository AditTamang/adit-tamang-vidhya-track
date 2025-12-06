import pool from "../config/dbConnection.js";

// Create link request
export const createLinkRequest = async (parentId, studentId) => {
  const result = await pool.query(
    `INSERT INTO parent_student (parent_id, student_id, status)
     VALUES ($1, $2, 'pending')
     RETURNING *`,
    [parentId, studentId]
  );

  return result.rows[0];
};

// Approve link
export const approveLink = async (parentId, studentId) => {
  const result = await pool.query(
    `UPDATE parent_student 
     SET status='approved'
     WHERE parent_id=$1 AND student_id=$2
     RETURNING *`,
    [parentId, studentId]
  );

  return result.rows[0];
};

// Fetch linked students
export const getLinkedStudents = async (parentId) => {
  const result = await pool.query(
    `SELECT s.id, s.name, s.email, s.phone_number
     FROM parent_student ps
     JOIN users s ON ps.student_id = s.id
     WHERE ps.parent_id=$1 AND ps.status='approved'`,
    [parentId]
  );

  return result.rows;
};
