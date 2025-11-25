import pool from "../config/dbConnection.js";

export const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email=$1", [
    email,
  ]);
  return result.rows[0];
};

export const createUser = async (name, email, phone_number, hashedPassword) => {
  const result = await pool.query(
    `INSERT INTO users (name, email,  phone_number , password) 
     VALUES ($1, $2, $3, $4) 
     RETURNING id, name, email,  phone_number , is_verified, created_at`,
    [name, email, phone_number, hashedPassword]
  );
  return result.rows[0];
};

export const verifyUserEmail = async (email) => {
  const result = await pool.query(
    `UPDATE users SET is_verified = TRUE 
     WHERE email = $1 
     RETURNING id, name, email, is_verified`,
    [email]
  );
  return result.rows[0];
};

export const updateUserPassword = async (email, hashedPassword) => {
  const result = await pool.query(
    `UPDATE users SET password = $1, updated_at = NOW() 
     WHERE email = $2 
     RETURNING id, email`,
    [hashedPassword, email]
  );
  return result.rows[0];
};
