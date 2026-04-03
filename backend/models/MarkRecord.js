const mongoose = require("mongoose");

// Student ge marks track karana model eka
const markRecordSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
    required: true,
  },
  marks: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  grade: String, // e.g., "A", "B"
  gpa: Number,   // e.g., 4.0
  remarks: String,
}, { timestamps: true });

// Prevent duplicate mark records for same student, subject, and exam
markRecordSchema.index({ student: 1, subject: 1, exam: 1 }, { unique: true });

module.exports = mongoose.model("MarkRecord", markRecordSchema);
