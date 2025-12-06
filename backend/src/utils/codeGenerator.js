import pool from "../config/dbConnection.js";

// Generate unique student code
export const generateStudentCode = async () => {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random
  const code = `STU${year}${random}`;

  const exists = await pool.query(
    "SELECT * FROM students WHERE student_code=$1",
    [code]
  );
  if (exists.rows.length > 0) return generateStudentCode(); // retry if exists

  return code;
};
