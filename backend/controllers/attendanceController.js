const StudentAttendance = require("../models/StudentAttendance");
const StaffAttendance = require("../models/StaffAttendance");
const performanceUtils = require("../utils/performanceUtils");

// STUDENT ATTENDANCE
exports.markStudentAttendance = async (req, res) => {
  try {
    const { studentId, date, status, remarks, academicYearId, classId } = req.body;
    
    // Normalize date to start of day
    const rollDate = new Date(date);
    rollDate.setHours(0,0,0,0);

    // SECURITY CHECK: If teacher, verify they are assigned to this class
    if (req.user.role === "teacher") {
      const ClassGrade = require("../models/ClassGrade");
      const assignedClass = await ClassGrade.findOne({ _id: classId, classTeacher: req.user.teacherId });
      if (!assignedClass) {
        return res.status(403).json({ message: "You are not authorized to mark attendance for this class" });
      }
    }

    let attendance = await StudentAttendance.findOne({ student: studentId, date: rollDate });
    
    if (attendance) {
      attendance.status = status;
      attendance.remarks = remarks;
      await attendance.save();
    } else {
      attendance = new StudentAttendance({ 
        student: studentId, 
        date: rollDate, 
        status, 
        remarks,
        academicYear: academicYearId,
        classGrade: classId
      });
      await attendance.save();
    }
    
    res.status(201).json(attendance);
  } catch (err) {
    res.status(500).json({ message: "Error marking Student Attendance", error: err.message });
  }
};

exports.getAllStudentAttendance = async (req, res) => {
  try {
    const { date, classId } = req.query;
    let filter = {};
    if (date) {
      filter.date = new Date(date).setHours(0,0,0,0);
    }
    if (classId) {
      filter.classGrade = classId;
    }
    
    const records = await StudentAttendance.find(filter)
      .populate("student", "firstName lastName")
      .populate("classGrade", "name section");
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ message: "Error fetching student attendance" });
  }
};

/**
 * Get Attendance Summary for a student
 * Calculates percentage and check exam eligibility (75% rule)
 */
exports.getStudentAttendanceSummary = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    
    const records = await StudentAttendance.find({ student: studentId });
    const totalDays = records.length;
    const presentDays = records.filter(r => r.status === "Present" || r.status === "Late").length;
    
    const percentage = performanceUtils.calculateAttendancePercentage(totalDays, presentDays);
    const isEligible = performanceUtils.isEligibleForExams(percentage);
    
    res.json({
      studentId,
      totalDays,
      presentDays,
      attendancePercentage: percentage + "%",
      examEligible: isEligible,
      statusMsg: isEligible ? "Qualified for Exams" : "Attendance < 75%: Not Qualified"
    });
  } catch (err) {
    res.status(500).send("Error fetching Student Attendance Summary");
  }
};

// STAFF ATTENDANCE
exports.markStaffAttendance = async (req, res) => {
  try {
    const { staffId, date, status, remarks } = req.body;
    
    // Check if attendance already marked for this day
    let attendance = await StaffAttendance.findOne({ staff: staffId, date: new Date(date).setHours(0,0,0,0) });
    
    if (attendance) {
      attendance.status = status;
      attendance.remarks = remarks;
      await attendance.save();
    } else {
      attendance = new StaffAttendance({ staff: staffId, date, status, remarks });
      await attendance.save();
    }
    
    res.status(201).json(attendance);
  } catch (err) {
    res.status(500).json({ message: "Error marking Staff Attendance", error: err.message });
  }
};

exports.getAllStaffAttendance = async (req, res) => {
  try {
    const { date } = req.query;
    let filter = {};
    if (date) {
      const searchDate = new Date(date);
      searchDate.setHours(0, 0, 0, 0);
      filter.date = searchDate;
    }
    
    const records = await StaffAttendance.find(filter).populate("staff", "firstName lastName department");
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ message: "Error fetching staff attendance" });
  }
};
