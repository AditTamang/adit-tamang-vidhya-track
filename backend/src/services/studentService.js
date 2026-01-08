import pool from "../config/dbConnection.js";

export const createStudentService = async (userId, className, section) => {
  const result = await pool.query(
    "INSERT INTO students (user_id, class, section) VALUES ($1, $2, $3) RETURNING *",
    [userId, className, section]
  );
  return result.rows[0];
};

export const getStudentByIdService = async (id) => {
  const result = await pool.query(
    `SELECT s.*, u.name, u.email, u.phone_number, u.profile_image 
     FROM students s 
     JOIN users u ON s.user_id = u.id 
     WHERE s.id = $1`,
    [id]
  );
  return result.rows[0];
};

// Get students in a specific section
// This is a simple function that looks up students by their section ID
export const getStudentsBySectionService = async (sectionId) => {
  // Step 1: First, get the section details (class name and section name)
  const sectionInfo = await pool.query(
    `SELECT sec.name as section_name, c.name as class_name
     FROM sections sec
     JOIN classes c ON c.id = sec.class_id
     WHERE sec.id = $1`,
    [sectionId]
  );

  // If section not found, return empty array
  if (sectionInfo.rows.length === 0) {
    return [];
  }

  // Get the class and section names from the result
  const className = sectionInfo.rows[0].class_name;
  const sectionName = sectionInfo.rows[0].section_name;

  // Step 2: Now find all students in that class and section
  const result = await pool.query(
    `SELECT 
       s.id,
       s.user_id,
       s.student_code,
       s.class,
       s.section,
       u.name,
       u.email,
       u.profile_image
     FROM students s
     JOIN users u ON s.user_id = u.id
     WHERE s.class = $1 AND s.section = $2
     ORDER BY u.name`,
    [className, sectionName]
  );

  // Return the list of students
  return result.rows;
};
