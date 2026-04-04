const express = require('express');
const router = express.Router();
const academicController = require('../controllers/academicController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

// Academic Years
router.get('/years', roleMiddleware(['admin', 'teacher']), academicController.getAcademicYears);
router.post('/years', roleMiddleware(['admin']), academicController.createAcademicYear);
router.put('/years/:id', roleMiddleware(['admin']), academicController.updateAcademicYear);
router.delete('/years/:id', roleMiddleware(['admin']), academicController.deleteAcademicYear);

// Classes
router.get('/classes/:yearId', roleMiddleware(['admin', 'teacher']), academicController.getClassesByYear);
router.post('/classes', roleMiddleware(['admin']), academicController.createClassGrade);
router.put('/classes/:id', roleMiddleware(['admin']), academicController.updateClassGrade);
router.delete('/classes/:id', roleMiddleware(['admin']), academicController.deleteClassGrade);

// Subjects
router.get('/subjects', roleMiddleware(['admin', 'teacher']), academicController.getAllSubjects);
router.post('/subjects', roleMiddleware(['admin']), academicController.createSubject);
router.put('/subjects/:id', roleMiddleware(['admin']), academicController.updateSubject);
router.delete('/subjects/:id', roleMiddleware(['admin']), academicController.deleteSubject);

module.exports = router;
