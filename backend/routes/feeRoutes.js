const express = require('express');
const router = express.Router();
const feeController = require('../controllers/feeController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

// Fee Structures - Only Admin can create
router.post('/structure', roleMiddleware(['admin']), feeController.createFeeStructure);

// Invoice Generation - Only Admin or Office staff (if added later)
router.post('/generate-invoices', roleMiddleware(['admin']), feeController.generateInvoicesForGrade);

// Payments & Overdue Details
router.get('/invoice/:id', roleMiddleware(['admin', 'parent']), feeController.getInvoiceDetails);
router.get('/student/:studentId', roleMiddleware(['admin', 'parent', 'student']), feeController.getStudentInvoices);

module.exports = router;
