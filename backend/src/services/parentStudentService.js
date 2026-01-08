import pool from "../config/dbConnection.js";

export const requestLinkByCodeService = async (parentId, studentCode) => {
  const result = await pool.query(
    "SELECT id, user_id FROM students WHERE student_code = $1", 
    [studentCode]
  );

  if (result.rows.length === 0) {
    throw new Error("Invalid Student Code.");
  }

  // legacy support: using student.id for link matching
  return requestLinkService(parentId, result.rows[0].id);
};

export const requestLinkService = async (parentId, studentId) => {
  // check if already requested
  const check = await pool.query(
    "SELECT status FROM parent_student_link WHERE parent_id = $1 AND student_id = $2",
    [parentId, studentId]
  );

  if (check.rows.length > 0) {
    if (check.rows[0].status === "approved") {
      throw new Error("Already linked to this student");
    }
    throw new Error("Request already sent");
  }

  const result = await pool.query(
    "INSERT INTO parent_student_link (parent_id, student_id) VALUES ($1, $2) RETURNING *",
    [parentId, studentId]
  );

  return result.rows[0];
};

export const approveLinkService = async (parentId, studentId, adminId) => {
  const result = await pool.query(
    `UPDATE parent_student_link 
     SET status = 'approved', approved_by = $1, approved_at = NOW()
     WHERE parent_id = $2 AND student_id = $3 AND status = 'pending'
     RETURNING *`,
    [adminId, parentId, studentId]
  );

  if (result.rows.length === 0) {
    throw new Error("Request not found");
  }

  return result.rows[0];
};

export const getLinkedStudentsService = async (parentId) => {
  const result = await pool.query(
    `SELECT 
        u.id, 
        u.name, 
        u.email, 
        s.student_code, 
        s.class AS class_name, 
        s.section, 
        psl.status
     FROM parent_student_link psl
     JOIN students s ON s.id = psl.student_id
     JOIN users u ON u.id = s.user_id
     WHERE psl.parent_id = $1 AND psl.status = 'approved'
     ORDER BY u.name`,
    [parentId]
  );

  return result.rows;
};
