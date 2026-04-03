const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

// Student Attendance
router.post('/student', roleMiddleware(['admin', 'teacher']), attendanceController.markStudentAttendance);
router.get('/student', roleMiddleware(['admin', 'teacher']), attendanceController.getAllStudentAttendance);
router.get('/student/summary/:studentId', attendanceController.getStudentAttendanceSummary);

// Staff Attendance
router.post('/staff', roleMiddleware(['admin']), attendanceController.markStaffAttendance);
router.get('/staff', roleMiddleware(['admin']), attendanceController.getAllStaffAttendance);

module.exports = router;
