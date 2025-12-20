// Simple migration script to setup database
import pool from "../config/dbConnection.js";
import bcrypt from "bcrypt";

async function runMigration() {
  console.log("Running VidhyaTrack database migration...\n");

  try {
    // Create users table
    await pool.query(`
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
    `);
    console.log("✓ Users table ready");

    // Create otps table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS otps (
        id SERIAL PRIMARY KEY,
        email VARCHAR(100) NOT NULL,
        otp VARCHAR(6) NOT NULL,
        purpose VARCHAR(50) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        is_used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("✓ OTPs table ready");

    // Create students table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        student_code VARCHAR(20) UNIQUE,
        class VARCHAR(20),
        section VARCHAR(10),
        roll_number VARCHAR(20),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("✓ Students table ready");

    // Create parents table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS parents (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("✓ Parents table ready");

    // Create teachers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS teachers (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        subject VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("✓ Teachers table ready");

    // Create parent_student table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS parent_student (
        id SERIAL PRIMARY KEY,
        parent_id INTEGER REFERENCES parents(id) ON DELETE CASCADE,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("✓ Parent-Student link table ready");

    // Add is_approved column if missing
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                       WHERE table_name='users' AND column_name='is_approved') THEN
          ALTER TABLE users ADD COLUMN is_approved BOOLEAN DEFAULT FALSE;
        END IF;
      END $$;
    `);
    console.log("✓ is_approved column verified");

    // Create admin user if not exists
    const adminExists = await pool.query(
      "SELECT id FROM users WHERE email = 'admin@gmail.com'"
    );

    if (adminExists.rows.length === 0) {
      const hashedPass = await bcrypt.hash("Admin@123", 10);
      await pool.query(
        `INSERT INTO users (name, email, phone_number, password, role, is_verified, is_approved)
         VALUES ('Admin', 'admin@gmail.com', '9800000000', $1, 'admin', TRUE, TRUE)`,
        [hashedPass]
      );
      console.log("✓ Admin user created (admin@gmail.com / Admin@123)");
    } else {
      console.log("✓ Admin user already exists");
    }

    console.log("\n✅ Migration complete!");
    process.exit(0);
  } catch (error) {
    console.error("Migration error:", error.message);
    process.exit(1);
  }
}

runMigration();
