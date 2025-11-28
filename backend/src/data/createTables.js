import pool from "../config/dbConnection.js";

const createTables = async () => {
  // Users table
  const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      phone_number VARCHAR(15),
      password VARCHAR(255) NOT NULL,
      is_verified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  // OTP table
  const otpTable = `
    CREATE TABLE IF NOT EXISTS otps (
      id SERIAL PRIMARY KEY,
      email VARCHAR(100) NOT NULL,
      otp VARCHAR(6) NOT NULL,
      purpose VARCHAR(50) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      is_used BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  // Create index for faster OTP lookups
  const otpIndex = `
    CREATE INDEX IF NOT EXISTS idx_otp_email_purpose 
    ON otps(email, purpose, is_used, expires_at)
  `;

  try {
    await pool.query(usersTable);
    await pool.query(otpTable);
    await pool.query(otpIndex);
    console.log("✓ Database tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error.message);
    throw error;
  }
};

export default createTables;
