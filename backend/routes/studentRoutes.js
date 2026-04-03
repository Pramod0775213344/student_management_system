const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Token check ok da kiyala balanna
router.use(authMiddleware);

// Okkomalata students list eka search karanna/balanna puluwan (Teacher/Admin)
router.get('/', roleMiddleware(['admin', 'teacher']), studentController.getAllStudents);
router.get('/:id', roleMiddleware(['admin', 'teacher']), studentController.getStudentById);

// Add/Update/Delete admin ta witharai
router.post('/', roleMiddleware(['admin']), studentController.createStudent);
router.put('/:id', roleMiddleware(['admin']), studentController.updateStudent);
router.delete('/:id', roleMiddleware(['admin']), studentController.deleteStudent);

module.exports = router;
