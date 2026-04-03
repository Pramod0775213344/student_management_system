const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/login', authController.login);
router.post('/create-account', authMiddleware, roleMiddleware('admin'), authController.createAccount);

module.exports = router;