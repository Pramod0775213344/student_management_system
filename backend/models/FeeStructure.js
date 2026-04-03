const mongoose = require("mongoose");

const feeStructureSchema = new mongoose.Schema({
  name: {
    type: String, // e.g., "Registration Fee", "Tuition Fee"
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  academicYear: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AcademicYear",
    required: true,
  },
  classGrade: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ClassGrade", // Optional: If empty, it's for all grades
  },
  description: String,
}, { timestamps: true });

module.exports = mongoose.model("FeeStructure", feeStructureSchema);
