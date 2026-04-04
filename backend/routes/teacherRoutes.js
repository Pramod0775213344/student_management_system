const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const assignmentController = require('../controllers/teacherAssignmentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

// Teacher CRUD
router.get('/', roleMiddleware(['admin', 'teacher']), teacherController.getAllTeachers);
router.get('/:id', roleMiddleware(['admin', 'teacher']), teacherController.getTeacherById);
router.post('/', roleMiddleware(['admin']), teacherController.createTeacher);
router.put('/:id', roleMiddleware(['admin']), teacherController.updateTeacher);
router.delete('/:id', roleMiddleware(['admin']), teacherController.deleteTeacher);

// Assignment Routes
router.get('/assignments', roleMiddleware(['admin', 'teacher']), assignmentController.getAllAssignments);
router.post('/assignments', roleMiddleware(['admin']), assignmentController.createAssignment);
router.delete('/assignments/:id', roleMiddleware(['admin']), assignmentController.deleteAssignment);

module.exports = router;
