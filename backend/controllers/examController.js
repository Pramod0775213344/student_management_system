const Exam = require("../models/Exam");
const MarkRecord = require("../models/MarkRecord");
const performanceUtils = require("../utils/performanceUtils");

// EXAM SCHEDULING
exports.createExamSchedule = async (req, res) => {
  try {
    const exam = new Exam(req.body);
    await exam.save();
    res.status(201).json(exam);
  } catch (err) {
    res.status(500).json({ message: "Error creating Exam Schedule" });
  }
};

exports.getAllExams = async (req, res) => {
  try {
    const { academicYear } = req.query;
    let filter = {};
    if (academicYear) filter.academicYear = academicYear;
    
    const exams = await Exam.find(filter).populate("academicYear", "name");
    res.status(200).json(exams);
  } catch (err) {
    res.status(500).json({ message: "Error fetching exams" });
  }
};

// MARKS ENTRY (Batch)
exports.submitBatchMarks = async (req, res) => {
  try {
    const { exam, subject, records } = req.body;
    
    if (!exam || !subject || !records || !Array.isArray(records)) {
      return res.status(400).json({ message: "Invalid batch data" });
    }

    const operations = records.map(record => {
      const { gpa, grade } = performanceUtils.calculateGPA(record.marks);
      return MarkRecord.findOneAndUpdate(
        { student: record.student, exam, subject },
        { 
          marks: record.marks, 
          grade, 
          gpa, 
          remarks: record.remarks 
        },
        { upsert: true, new: true }
      );
    });

    await Promise.all(operations);
    res.status(200).json({ message: "Batch marks submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error submitting batch marks", error: err.message });
  }
};

exports.getMarksByContext = async (req, res) => {
  try {
    const { exam, subject, classId } = req.query;
    const filter = { exam, subject };
    
    // We fetch all records for this exam/subject
    const records = await MarkRecord.find(filter);
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ message: "Error fetching marks" });
  }
};

/**
 * Get Student Performance across a term
 */
exports.getStudentPerformance = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const records = await MarkRecord.find({ student: studentId }).populate("subject").populate("exam");
    
    const totalGPA = records.reduce((acc, curr) => acc + curr.gpa, 0);
    const avgGPA = totalGPA / records.length;
    
    res.json({
      studentId,
      records,
      cgpa: avgGPA.toFixed(2),
      status: avgGPA >= 2.0 ? "Pass" : "Fail"
    });
  } catch (err) {
    res.status(500).send("Error fetching performance details");
  }
};
