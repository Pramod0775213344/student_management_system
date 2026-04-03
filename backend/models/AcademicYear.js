const mongoose = require("mongoose");

const academicYearSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // e.g., "2024-2025"
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
    enum: ["Active", "Inactive"],
    default: "Inactive",
  },
}, { timestamps: true });

// Ensure only one Academic Year is active at a time
academicYearSchema.pre("save", async function () {
  try {
    if (this.isModified("status") && this.status === "Active") {
      const AcademicYearModel = mongoose.models.AcademicYear || mongoose.model("AcademicYear");
      await AcademicYearModel.updateMany({ _id: { $ne: this._id } }, { status: "Inactive" });
    }
  } catch (err) {
    console.error("Academic Year Hook Error:", err);
    throw err; // Re-throw to be caught by the model's save method
  }
});

module.exports = mongoose.models.AcademicYear || mongoose.model("AcademicYear", academicYearSchema);
