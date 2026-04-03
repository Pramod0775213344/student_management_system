const mongoose = require("mongoose");

const schoolDocumentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // e.g., "ID Card", "Transfer Certificate"
  },
  fileUrl: {
    type: String, // Path to file or URL
    required: true,
  },
  category: {
    type: String,
    enum: ["Government-ID", "Academic-Certificate", "Medical-Record", "Misc"],
    default: "Misc",
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
}, { timestamps: true });

module.exports = mongoose.model("SchoolDocument", schoolDocumentSchema);
