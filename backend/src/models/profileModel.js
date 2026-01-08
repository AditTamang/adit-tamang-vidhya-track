import pool from "../config/dbConnection.js";

export const updateProfileModel = async (userId, name, phone_number) => {
  const result = await pool.query(
    `UPDATE users 
     SET name = $1, phone_number = $2, updated_at = NOW() 
     WHERE id = $3 
     RETURNING id, name, email, phone_number, role`,
    [name, phone_number, userId]
  );
  return result.rows[0];
};
