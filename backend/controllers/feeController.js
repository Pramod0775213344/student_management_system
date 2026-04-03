const FeeStructure = require("../models/FeeStructure");
const Invoice = require("../models/Invoice");
const feeUtils = require("../utils/feeUtils");

// FEE STRUCTURE
exports.createFeeStructure = async (req, res) => {
  try {
    const fee = new FeeStructure(req.body);
    await fee.save();
    res.status(201).json(fee);
  } catch (err) {
    res.status(500).send("Error creating Fee Structure");
  }
};

// INVOICE / PAYMENTS
exports.generateInvoicesForGrade = async (req, res) => {
  try {
    const { classGrade, feeStructure, dueDate } = req.body;
    const students = await require("../models/Student").find({ classGrade });
    const fee = await FeeStructure.findById(feeStructure);
    
    // Invoices generation logic
    const invoices = await Promise.all(students.map(async (student) => {
      const invoice = new Invoice({
        student: student._id,
        feeStructure: fee._id,
        dueDate,
        amount: fee.amount,
        status: "Pending"
      });
      return await invoice.save();
    }));
    
    res.status(201).json(invoices);
  } catch (err) {
    res.status(500).send("Error generating Invoices");
  }
};

/**
 * Get Invoice Details with late fee automation
 */
exports.getInvoiceDetails = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate("student").populate("feeStructure");
    
    if (!invoice) return res.status(404).send("Invoice not found");
    
    // Late Fee & Status calculation automation
    const lateFee = feeUtils.calculateLateFee(invoice.amount, invoice.dueDate);
    const currentStatus = feeUtils.determineInvoiceStatus(invoice.amount + lateFee, invoice.paidAmount, invoice.dueDate);
    
    // Update invoice if status changed
    if (invoice.status !== currentStatus || invoice.lateFee !== lateFee) {
      invoice.status = currentStatus;
      invoice.lateFee = lateFee;
      await invoice.save();
    }
    
    res.json(invoice);
  } catch (err) {
    res.status(500).send("Error fetching Invoice Details");
  }
};

/**
 * Get all invoices for a specific student
 */
exports.getStudentInvoices = async (req, res) => {
  try {
    const { studentId } = req.params;
    const invoices = await Invoice.find({ student: studentId }).populate("feeStructure");
    
    // Automation: check each invoice for late fees and status updates before returning
    const updatedInvoices = await Promise.all(invoices.map(async (invoice) => {
      const lateFee = feeUtils.calculateLateFee(invoice.amount, invoice.dueDate);
      const currentStatus = feeUtils.determineInvoiceStatus(invoice.amount + lateFee, invoice.paidAmount, invoice.dueDate);
      
      if (invoice.status !== currentStatus || invoice.lateFee !== lateFee) {
        invoice.status = currentStatus;
        invoice.lateFee = lateFee;
        await invoice.save();
      }
      return invoice;
    }));

    res.json(updatedInvoices);
  } catch (err) {
    console.error("Error fetching student invoices:", err);
    res.status(500).send("Error fetching student invoices");
  }
};
