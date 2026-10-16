const SubjectAssignment = require("../models/SubjectAssignment");

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
    const { exam, subject } = req.query;
    const filter = {};
    if (exam) filter.exam = exam;
    if (subject) filter.subject = subject;
    
    const records = await MarkRecord.find(filter).populate("student", "firstName lastName studentID");
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ message: "Error fetching marks" });
  }
};

/**
 * Get Student Report Card (Personalized)
 */
exports.getStudentReportCard = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { academicYear } = req.query;
    
    // Fetch all mark records for this student and populate exam to filter by academic year
    const rawRecords = await MarkRecord.find({ student: studentId })
      .populate({
        path: "exam",
        match: academicYear ? { academicYear } : {},
        populate: { path: "academicYear", select: "name" }
      })
      .populate("subject", "subjectName subjectCode");

    // Filter out records where the exam didn't match the academicYear filter
    const records = rawRecords.filter(r => r.exam);

    if (records.length === 0) {
      return res.status(200).json({ records: [], cgpa: "0.00", message: "No records found" });
    }

    const totalGPA = records.reduce((acc, curr) => acc + (curr.gpa || 0), 0);
    const avgGPA = totalGPA / records.length;
    
    res.json({
      studentId,
      records,
      cgpa: avgGPA.toFixed(2),
      status: avgGPA >= 2.0 ? "Pass" : "Fail"
    });
  } catch (err) {
    res.status(500).json({ message: "Error generating report card", error: err.message });
  }
};

/**
 * Get results for subjects assigned to a specific teacher
 */
exports.getTeacherAssignedResults = async (req, res) => {
  try {
    const { teacherId } = req.params;
    
    // 1. Get subjects assigned to this teacher
    const assignments = await SubjectAssignment.find({ teacher: teacherId })
      .populate("subject", "subjectName")
      .populate("classGrade", "className section");

    const subjectIds = assignments.map(a => a.subject._id);

    // 2. Get marks for these subjects
    const marks = await MarkRecord.find({ subject: { $in: subjectIds } })
      .populate("student", "firstName lastName studentID")
      .populate("subject", "subjectName")
      .populate("exam", "examName");

    res.status(200).json({ assignments, marks });
  } catch (err) {
    res.status(500).json({ message: "Error fetching teacher results", error: err.message });
  }
};
