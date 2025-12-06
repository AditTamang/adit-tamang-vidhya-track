import pool from "../config/dbConnection.js";

// Generate unique student code
export const generateStudentCode = async () => {
  const code = "STD" + Math.floor(1000 + Math.random() * 9000);
  const exists = await pool.query(
    "SELECT * FROM students WHERE student_code=$1",
    [code]
  );
  if (exists.rows.length > 0) return generateStudentCode();
  return code;
};

// Create student
export const createStudentService = async (userId, className, section) => {
  const studentCode = await generateStudentCode();
  const result = await pool.query(
    `INSERT INTO students (user_id, student_code, class, section)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [userId, studentCode, className, section]
  );
  return result.rows[0];
};

// Get student by id
export const getStudentByIdService = async (id) => {
  const result = await pool.query("SELECT * FROM students WHERE id=$1", [id]);
  return result.rows[0];
};
