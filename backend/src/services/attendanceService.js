import pool from '../config/dbConnection.js';

export const markAttendance = async (attendanceData, userId) => {
    const records = Array.isArray(attendanceData) ? attendanceData : [attendanceData];
    const results = [];

    for (let i = 0; i < records.length; i++) {
        const record = records[i];
        
        const result = await pool.query(
            `INSERT INTO attendance (student_id, class_id, date, status, remarks, created_by)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (student_id, date, class_id) 
             DO UPDATE SET 
                status = EXCLUDED.status, 
                remarks = EXCLUDED.remarks, 
                created_by = EXCLUDED.created_by
             RETURNING *`,
            [record.student_id, record.class_id, record.date, record.status, record.remarks, userId]
        );
        results.push(result.rows[0]);
    }
    return results;
};

export const getClassAttendance = async (classId, date) => {
    const result = await pool.query(
        `SELECT a.*, u.name as student_name 
         FROM attendance a
         JOIN users u ON a.student_id = u.id
         WHERE a.class_id = $1 AND a.date = $2`,
        [classId, date]
    );
    return result.rows;
};

export const getStudentAttendance = async (studentId, startDate, endDate) => {
    const result = await pool.query(
        `SELECT * FROM attendance 
         WHERE student_id = $1 AND date BETWEEN $2 AND $3
         ORDER BY date DESC`,
        [studentId, startDate, endDate]
    );
    return result.rows;
};
