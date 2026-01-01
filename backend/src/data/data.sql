-- 1. Create Admin User (Password: Admin@123)
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

-- 2. Seed Classes
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

-- 3. Seed Sections
-- Assuming Class IDs 1-10 are generated sequentially. 
-- In production, might want to look up IDs, but for seed data this is standard.
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

