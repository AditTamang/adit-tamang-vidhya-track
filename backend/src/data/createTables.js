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
    CREATE TABLE IF NOT EXISTS parent_student_link (
      id SERIAL PRIMARY KEY,
      parent_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      status VARCHAR(20) DEFAULT 'pending',
      approved_by INTEGER REFERENCES users(id),
      requested_at TIMESTAMP DEFAULT NOW(),
      approved_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(parent_id, student_id)
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
    
    // Academic Structure
    await pool.query(`
      CREATE TABLE IF NOT EXISTS classes (
          id SERIAL PRIMARY KEY,
          name VARCHAR(50) NOT NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sections (
          id SERIAL PRIMARY KEY,
          name VARCHAR(10) NOT NULL,
          class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
          teacher_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Roles
    await pool.query(studentsTable);
    await pool.query(parentsTable);
    await pool.query(teachersTable);
    
    // Relationships & Records
    // parent_student_link table is created above via parentStudentTable variable

    await pool.query(`
      CREATE TABLE IF NOT EXISTS grades (
          id SERIAL PRIMARY KEY,
          student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          subject VARCHAR(100) NOT NULL,
          marks DECIMAL(5,2) NOT NULL,
          total_marks DECIMAL(5,2) DEFAULT 100,
          grade VARCHAR(5),
          exam_type VARCHAR(50) DEFAULT 'regular',
          remarks TEXT,
          created_by INTEGER REFERENCES users(id),
          created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS schedules (
          id SERIAL PRIMARY KEY,
          title VARCHAR(200) NOT NULL,
          description TEXT,
          event_date DATE NOT NULL,
          start_time TIME,
          end_time TIME,
          class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
          status VARCHAR(20) DEFAULT 'upcoming',
          created_by INTEGER REFERENCES users(id),
          created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS academic_years (
          id SERIAL PRIMARY KEY,
          name VARCHAR(50) NOT NULL,
          start_date DATE NOT NULL,
          end_date DATE NOT NULL,
          is_active BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
          id SERIAL PRIMARY KEY,
          admin_id INTEGER REFERENCES users(id),
          action VARCHAR(100) NOT NULL,
          target_type VARCHAR(50),
          target_id INTEGER,
          details TEXT,
          created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS attendance (
          id SERIAL PRIMARY KEY,
          student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
          date DATE NOT NULL,
          status VARCHAR(20) NOT NULL,
          remarks TEXT,
          created_by INTEGER REFERENCES users(id),
          created_at TIMESTAMP DEFAULT NOW(),
          UNIQUE(student_id, date, class_id)
      );
    `);

    await pool.query(otpIndex);
    console.log("✓ Database tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error.message);
    throw error;
  }
};

export default createTables;
