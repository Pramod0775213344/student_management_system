const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  audience: {
    type: String,
    enum: ["All", "Students", "Teachers", "Parents"],
    default: "All",
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  publishDate: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
    enum: ["Academic", "Staff", "Event", "Holiday", "Misc"],
    default: "Misc",
  },
}, { timestamps: true });

module.exports = mongoose.model("Notice", noticeSchema);
