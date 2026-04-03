const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: String,
  dob: Date,
  contactNumber: String,
  address: String,
  // String base grade/section wenuwata ClassGrade ref eka use karanawa
  classGrade: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ClassGrade",
  },
  parents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Parent",
  }],
  academicYear: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AcademicYear",
  },
  guardianName: String,
  guardianContact: String,
  admissionDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive", "Alumni", "Dropped"],
    default: "Active",
  },
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
