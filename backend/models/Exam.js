const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
  name: {
    type: String, // e.g., "Mid-term", "Final"
    required: true,
  },
  academicYear: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AcademicYear",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Upcoming", "Ongoing", "Completed"],
    default: "Upcoming",
  },
}, { timestamps: true });

module.exports = mongoose.model("Exam", examSchema);
