import pool from "../config/dbConnection.js";

// Add grade for a student
export const addStudentGradeService = async (
  student_id,
  term,
  subject,
  marks,
  grade
) => {
  const result = await pool.query(
    `INSERT INTO student_grades (student_id, term, subject, marks, grade)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [student_id, term, subject, marks, grade]
  );
  return result.rows[0];
};

// Get grades for a student
export const getStudentGradesService = async (student_id) => {
  const result = await pool.query(
    `SELECT * FROM student_grades WHERE student_id=$1 ORDER BY created_at DESC`,
    [student_id]
  );
  return result.rows;
};
