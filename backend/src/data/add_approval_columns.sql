-- VidhyaTrack Database Setup Script
-- Run this in Supabase SQL Editor

-- Step 1: Drop existing tables (if you want fresh start)
-- WARNING: This will delete all data!
-- DROP TABLE IF EXISTS parent_student CASCADE;
-- DROP TABLE IF EXISTS students CASCADE;
-- DROP TABLE IF EXISTS parents CASCADE;
-- DROP TABLE IF EXISTS teachers CASCADE;
-- DROP TABLE IF EXISTS otps CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- Step 2: Create Users table
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
);

-- Step 3: Create OTPs table
CREATE TABLE IF NOT EXISTS otps (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    purpose VARCHAR(50) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Step 4: Create Students table
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    student_code VARCHAR(20) UNIQUE,
    class VARCHAR(20),
    section VARCHAR(10),
    roll_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Step 5: Create Parents table
CREATE TABLE IF NOT EXISTS parents (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Step 6: Create Teachers table
CREATE TABLE IF NOT EXISTS teachers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Step 7: Create Parent-Student link table
CREATE TABLE IF NOT EXISTS parent_student (
    id SERIAL PRIMARY KEY,
    parent_id INTEGER REFERENCES parents(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Step 8: Add indexes
CREATE INDEX IF NOT EXISTS idx_otp_email_purpose ON otps(email, purpose, is_used, expires_at);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Step 9: Add is_approved column if missing (for existing databases)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='users' AND column_name='is_approved') THEN
        ALTER TABLE users ADD COLUMN is_approved BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Step 10: Create admin user (password is 'Admin@123')
-- The hash is for 'Admin@123' with bcrypt
INSERT INTO users (name, email, phone_number, password, role, is_verified, is_approved)
VALUES (
    'Admin',
    'admin@gmail.com',
    '9800000000',
    '$2b$10$rqKzN.vBxW7NnZ8kAzT3EOKqPOJLc8U1qMxGfLxNj.YpXQnYqVxMa',
    'admin',
    TRUE,
    TRUE
) ON CONFLICT (email) DO NOTHING;

-- Verify tables created
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

