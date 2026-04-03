const mongoose = require("mongoose");

const subjectAssignmentSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  classGrade: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ClassGrade",
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  academicYear: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AcademicYear",
    required: true,
  }
}, { timestamps: true });

// Ensure a teacher is not assigned to the same subject in the same class twice
subjectAssignmentSchema.index({ teacher: 1, classGrade: 1, subject: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.model("SubjectAssignment", subjectAssignmentSchema);
