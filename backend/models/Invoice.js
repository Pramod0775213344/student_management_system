const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  feeStructure: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FeeStructure",
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paidAmount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["Paid", "Pending", "Overdue", "Partially-Paid"],
    default: "Pending",
  },
  lateFee: {
    type: Number,
    default: 0,
  },
  paymentDate: Date,
}, { timestamps: true });

module.exports = mongoose.model("Invoice", invoiceSchema);
