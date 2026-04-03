const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // e.g., "Mathematics"
  },
  code: {
    type: String,
    required: true,
    unique: true, // e.g., "MATH101"
  },
  description: String,
  type: {
    type: String,
    enum: ["Core", "Elective"], // e.g., Mathematics is Core
    default: "Core",
  },
  creditHours: {
    type: Number,
    required: true,
  },
  department: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model("Subject", subjectSchema);
