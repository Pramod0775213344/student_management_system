const SubjectAssignment = require("../models/SubjectAssignment");
const Teacher = require("../models/Teacher");
const ClassGrade = require("../models/ClassGrade");
const Subject = require("../models/Subject");
const AcademicYear = require("../models/AcademicYear");

// Assign Subject to Teacher
exports.createAssignment = async (req, res) => {
  try {
    const { teacherId, classId, subjectId, academicYearId } = req.body;
    
    // Check for duplicates
    const existing = await SubjectAssignment.findOne({
      classGrade: classId,
      subject: subjectId,
      academicYear: academicYearId
    });

    if (existing) {
      return res.status(400).json({ message: "This subject is already assigned to a teacher in this class" });
    }

    const assignment = new SubjectAssignment({
      teacher: teacherId,
      classGrade: classId,
      subject: subjectId,
      academicYear: academicYearId
    });

    await assignment.save();
    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ message: "Error creating assignment", error: err.message });
  }
};

// Get All Assignments (With Populated Data)
exports.getAllAssignments = async (req, res) => {
  try {
    console.log("Fetching assignments for:", { classId, academicYearId });
    
    let filter = {};
    if (classId && classId !== "undefined") filter.classGrade = classId;
    if (academicYearId && academicYearId !== "undefined") filter.academicYear = academicYearId;

    const assignments = await SubjectAssignment.find(filter)
      .populate("teacher", "firstName lastName email department")
      .populate("classGrade", "name section")
      .populate("subject", "name code")
      .populate("academicYear", "name");

    console.log(`Found ${assignments.length} assignments`);
    res.status(200).json(assignments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching assignments" });
  }
};

// Delete Assignment
exports.deleteAssignment = async (req, res) => {
  try {
    await SubjectAssignment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Assignment removed" });
  } catch (err) {
    res.status(500).json({ message: "Error removing assignment" });
  }
};
