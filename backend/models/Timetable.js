const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
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
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  day: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    required: true,
  },
  startTime: {
    type: String, // e.g., "08:00"
    required: true,
  },
  endTime: {
    type: String, // e.g., "09:00"
    required: true,
  },
  roomNumber: String,
}, { timestamps: true });

// Avoid duplicate schedules for same class on same day and time
timetableSchema.index({ classGrade: 1, day: 1, startTime: 1 }, { unique: true });

module.exports = mongoose.model("Timetable", timetableSchema);
