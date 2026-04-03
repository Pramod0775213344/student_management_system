const mongoose = require("mongoose");

const staffAttendanceSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Present", "Absent", "On-Leave", "Late"],
    default: "Present",
  },
  checkIn: String, // Time string e.g. "08:00 AM"
  checkOut: String, // Time string
  remarks: String,
}, { timestamps: true });

// Prevent duplicate attendance for same teacher on same date
staffAttendanceSchema.index({ teacher: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("StaffAttendance", staffAttendanceSchema);
