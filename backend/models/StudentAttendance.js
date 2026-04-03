const mongoose = require("mongoose");

const studentAttendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  classGrade: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ClassGrade",
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Present", "Absent", "Late"],
    default: "Present",
  },
  remarks: String,
}, { timestamps: true });

// Prevent duplicate attendance for same student on same date
studentAttendanceSchema.index({ student: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("StudentAttendance", studentAttendanceSchema);
