import * as attendanceService from '../services/attendanceService.js';

// Mark attendance
export const markAttendance = async (req, res) => {
    try {
        const { attendance } = req.body; // Array of { student_id, class_id, date, status, remarks }
        if (!attendance) {
            return res.status(400).json({ error: 'Attendance data is required' });
        }
        
        const result = await attendanceService.markAttendance(attendance, req.user.id);
        res.status(200).json({ message: 'Attendance marked successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to mark attendance' });
    }
};

// Get class attendance for a specific date
export const getClassAttendance = async (req, res) => {
    try {
        const { classId, date } = req.query;
        if (!classId || !date) {
            return res.status(400).json({ error: 'Class ID and date are required' });
        }

        const data = await attendanceService.getClassAttendance(classId, date);
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch class attendance' });
    }
};

// Get student attendance
export const getStudentAttendance = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { startDate, endDate } = req.query;
        
        // Default to current month if no dates provided
        const now = new Date();
        const start = startDate || new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        const end = endDate || new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

        const data = await attendanceService.getStudentAttendance(studentId, start, end);
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch student attendance' });
    }
};
