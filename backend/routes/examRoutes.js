const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

// Exam Schedules
router.post('/schedule', roleMiddleware(['admin']), examController.createExamSchedule);
router.get('/', roleMiddleware(['admin', 'teacher']), examController.getAllExams);

// Mark Records - Teachers and Admins can manage marks
router.post('/marks/batch', roleMiddleware(['admin', 'teacher']), examController.submitBatchMarks);
router.get('/marks', roleMiddleware(['admin', 'teacher']), examController.getMarksByContext);
router.get('/performance/:studentId', examController.getStudentPerformance);

module.exports = router;
