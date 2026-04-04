const express = require("express");
const router = express.Router();
const timetableController = require("../controllers/timetableController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// All routes require authentication
router.use(authMiddleware);

// Admin-only operations
router.post("/", roleMiddleware(["admin"]), timetableController.createTimetable);
router.put("/:id", roleMiddleware(["admin"]), timetableController.updateTimetable);
router.delete("/:id", roleMiddleware(["admin"]), timetableController.deleteTimetable);

// Shared operations
router.get("/class/:classId", roleMiddleware(["admin", "teacher", "student"]), timetableController.getTimetableByClass);
router.get("/teacher/:teacherId", roleMiddleware(["admin", "teacher"]), timetableController.getTimetableByTeacher);

module.exports = router;
