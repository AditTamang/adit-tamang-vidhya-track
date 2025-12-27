-- ============================================
-- VIDHYATRACK DATABASE SCHEMA
-- Run this SQL in your PostgreSQL database
-- ============================================

-- Classes Table
CREATE TABLE IF NOT EXISTS classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Sections Table
CREATE TABLE IF NOT EXISTS sections (
    id SERIAL PRIMARY KEY,
    name VARCHAR(10) NOT NULL,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    teacher_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Grades Table
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

-- Schedules / Events Table
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

-- Parent-Student Links Table (if not exists)
CREATE TABLE IF NOT EXISTS parent_student_links (
    id SERIAL PRIMARY KEY,
    parent_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending',
    approved_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(parent_id, student_id)
);

-- Sample Data for Testing
-- Insert some classes
INSERT INTO classes (name, description) VALUES 
('Grade 1', 'First grade students'),
('Grade 2', 'Second grade students'),
('Grade 3', 'Third grade students'),
('Grade 4', 'Fourth grade students'),
('Grade 5', 'Fifth grade students'),
('Grade 6', 'Sixth grade students'),
('Grade 7', 'Seventh grade students'),
('Grade 8', 'Eighth grade students'),
('Grade 9', 'Ninth grade students'),
('Grade 10', 'Tenth grade students')
ON CONFLICT DO NOTHING;

-- Insert some sections
INSERT INTO sections (name, class_id) VALUES 
('A', 1), ('B', 1),
('A', 2), ('B', 2),
('A', 3), ('B', 3),
('A', 4), ('B', 4),
('A', 5), ('B', 5),
('A', 6), ('B', 6),
('A', 7), ('B', 7),
('A', 8), ('B', 8),
('A', 9), ('B', 9),
('A', 10), ('B', 10)
ON CONFLICT DO NOTHING;
