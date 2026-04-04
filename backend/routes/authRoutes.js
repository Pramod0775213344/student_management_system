const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/login', authController.login);
router.post('/create-account', authMiddleware, roleMiddleware('admin'), authController.createAccount);

// Fetch students/teachers who don't have accounts yet
router.get('/unaccounted-students', authMiddleware, roleMiddleware('admin'), authController.getUnaccountedStudents);
router.get('/unaccounted-teachers', authMiddleware, roleMiddleware('admin'), authController.getUnaccountedTeachers);

module.exports = router;