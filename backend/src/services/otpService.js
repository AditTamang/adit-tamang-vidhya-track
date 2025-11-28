import pool from "../config/dbConnection.js";
import crypto from "crypto";

// Generate 6-digit OTP
export const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Save OTP to database
export const saveOTP = async (email, otp, purpose) => {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await pool.query(
    `INSERT INTO otps (email, otp, purpose, expires_at) 
     VALUES ($1, $2, $3, $4)`,
    [email, otp, purpose, expiresAt]
  );
};

// Verify OTP
export const verifyOTP = async (email, otp, purpose) => {
  const result = await pool.query(
    `SELECT * FROM otps 
     WHERE email = $1 AND otp = $2 AND purpose = $3 
     AND is_used = FALSE AND expires_at > NOW()
     ORDER BY created_at DESC LIMIT 1`,
    [email, otp, purpose]
  );

  if (result.rows.length === 0) {
    return false;
  }

  // Mark OTP as used
  await pool.query(`UPDATE otps SET is_used = TRUE WHERE id = $1`, [
    result.rows[0].id,
  ]);

  return true;
};

export const checkOTPValidity = async (email, otp, purpose) => {
  const result = await pool.query(
    `SELECT * FROM otps 
     WHERE email = $1 AND otp = $2 AND purpose = $3 
     AND is_used = FALSE AND expires_at > NOW()
     ORDER BY created_at DESC LIMIT 1`,
    [email, otp, purpose]
  );

  return result.rows.length>0;
};

// Clean up expired OTPs
export const cleanupExpiredOTPs = async () => {
  await pool.query(`DELETE FROM otps WHERE expires_at < NOW()`);
};
