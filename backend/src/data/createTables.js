import pool from "../config/dbConnection.js";

const createTables = async () => {
  // Users table with role and admin approval
  const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      phone_number VARCHAR(15),
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) DEFAULT 'student',
      is_verified BOOLEAN DEFAULT FALSE,
      is_approved BOOLEAN DEFAULT FALSE,
      profile_image TEXT,
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

  // Students table (extra info for students)
  const studentsTable = `
    CREATE TABLE IF NOT EXISTS students (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      student_code VARCHAR(20) UNIQUE,
      class VARCHAR(20),
      section VARCHAR(10),
      roll_number VARCHAR(20),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  // Parents table
  const parentsTable = `
    CREATE TABLE IF NOT EXISTS parents (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  // Teachers table
  const teachersTable = `
    CREATE TABLE IF NOT EXISTS teachers (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      subject VARCHAR(100),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  // Parent-Student link (which parent is linked to which student)
  const parentStudentTable = `
    CREATE TABLE IF NOT EXISTS parent_student (
      id SERIAL PRIMARY KEY,
      parent_id INTEGER REFERENCES parents(id) ON DELETE CASCADE,
      student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
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
    await pool.query(studentsTable);
    await pool.query(parentsTable);
    await pool.query(teachersTable);
    await pool.query(parentStudentTable);
    await pool.query(otpIndex);
    console.log("✓ Database tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error.message);
    throw error;
  }
};

export default createTables;
