const Timetable = require("../models/Timetable");
const ClassGrade = require("../models/ClassGrade");
const Subject = require("../models/Subject");
const Teacher = require("../models/Teacher");

// @desc    Create a new timetable entry
// @route   POST /api/timetable
// @access  Private/Admin
exports.createTimetable = async (req, res) => {
  try {
    const { classGrade, subject, teacher, day, startTime, endTime, roomNumber } = req.body;

    // Check for overlaps for the same class
    const overlapClass = await Timetable.findOne({ classGrade, day, startTime });
    if (overlapClass) {
      return res.status(400).json({ message: "Class already has a lesson at this time." });
    }

    // Check for overlaps for the same teacher
    const overlapTeacher = await Timetable.findOne({ teacher, day, startTime });
    if (overlapTeacher) {
      return res.status(400).json({ message: "Teacher is already busy at this time." });
    }

    const timetable = new Timetable({
      classGrade,
      subject,
      teacher,
      day,
      startTime,
      endTime,
      roomNumber,
    });

    const savedTimetable = await timetable.save();
    res.status(201).json(savedTimetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get timetable by Class ID
// @route   GET /api/timetable/class/:classId
// @access  Private
exports.getTimetableByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const timetable = await Timetable.find({ classGrade: classId })
      .populate("subject", "subjectName subjectCode")
      .populate("teacher", "name")
      .populate("classGrade", "className section");
    
    res.status(200).json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get timetable by Teacher ID
// @route   GET /api/timetable/teacher/:teacherId
// @access  Private
exports.getTimetableByTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const timetable = await Timetable.find({ teacher: teacherId })
      .populate("subject", "subjectName subjectCode")
      .populate("classGrade", "className section")
      .populate("teacher", "name");

    res.status(200).json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a timetable entry
// @route   PUT /api/timetable/:id
// @access  Private/Admin
exports.updateTimetable = async (req, res) => {
  try {
    const updated = await Timetable.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Entry not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a timetable entry
// @route   DELETE /api/timetable/:id
// @access  Private/Admin
exports.deleteTimetable = async (req, res) => {
  try {
    const deleted = await Timetable.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Entry not found" });
    res.status(200).json({ message: "Entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
