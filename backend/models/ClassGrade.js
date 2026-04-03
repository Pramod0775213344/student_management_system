const mongoose = require("mongoose");

const classGradeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // e.g., "Grade 10"
  },
  section: {
    type: String,
    required: true, // e.g., "A"
  },
  capacity: {
    type: Number,
    required: true,
    default: 40, // Seating limit
  },
  classTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
  roomNumber: String,
  academicYear: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AcademicYear",
    required: true,
  },
}, { timestamps: true });

// Ensure unique Section within a Grade and Academic Year
classGradeSchema.index({ name: 1, section: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.model("ClassGrade", classGradeSchema);
