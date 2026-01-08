import express from 'express';
import * as attendanceController from '../controllers/attendanceController.js';
import { verifyToken, isTeacher, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Mark attendance (Teacher only)
router.post('/mark', verifyToken, isTeacher, attendanceController.markAttendance);

// Get attendance for a class (Teacher/Admin)
router.get('/class', verifyToken, isTeacher, attendanceController.getClassAttendance);

// Get attendance for a student (Student/Parent/Admin/Teacher)
router.get('/student/:studentId', verifyToken, attendanceController.getStudentAttendance);

export default router;
