const AcademicYear = require("../models/AcademicYear");
const ClassGrade = require("../models/ClassGrade");
const Subject = require("../models/Subject");

// ACADEMIC YEAR
exports.createAcademicYear = async (req, res) => {
  console.log("Attempting to create academic year with data:", req.body);
  try {
    const year = new AcademicYear(req.body);
    await year.save();
    console.log("Academic year created successfully:", year._id);
    res.status(201).json(year);
  } catch (err) {
    console.error("Academic Year Creation Failed! Full Error:", err);
    
    if (err.code === 11000) {
       return res.status(400).json({ 
         message: "එම වසර නාමය දැනටමත් පද්ධතියේ පවතියි (Duplicate Year Name)",
         error: "Duplicate key"
       });
    }
    
    res.status(500).json({ 
      message: "වැරැද්දක් සිදුවිය: " + (err.message || "Unknown error"),
      error: err.toString()
    });
  }
};

exports.getAcademicYears = async (req, res) => {
  try {
    const years = await AcademicYear.find().sort({ name: -1 });
    res.json(years);
  } catch (err) {
    res.status(500).send("Error fetching Academic Years");
  }
};

exports.updateAcademicYear = async (req, res) => {
  try {
    const year = await AcademicYear.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(year);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "මෙහි නව නම (Name) දැනටමත් භාවිතයේ ඇත" });
    }
    res.status(500).json({ message: "Error updating Academic Year" });
  }
};

exports.deleteAcademicYear = async (req, res) => {
  try {
    await AcademicYear.findByIdAndDelete(req.params.id);
    res.status(200).send("Academic Year deleted");
  } catch (err) {
    res.status(500).send("Error deleting Academic Year");
  }
};

// CLASS / GRADE
exports.createClassGrade = async (req, res) => {
  try {
    const classGrade = new ClassGrade(req.body);
    await classGrade.save();
    res.status(201).json(classGrade);
  } catch (err) {
    res.status(500).send("Error creating Class Grade");
  }
};

exports.getClassesByYear = async (req, res) => {
  try {
    const classes = await ClassGrade.find({ academicYear: req.params.yearId }).populate("classTeacher");
    res.json(classes);
  } catch (err) {
    res.status(500).send("Error fetching Classes");
  }
};

exports.updateClassGrade = async (req, res) => {
  try {
    const classGrade = await ClassGrade.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(classGrade);
  } catch (err) {
    res.status(500).send("Error updating Class Grade");
  }
};

exports.deleteClassGrade = async (req, res) => {
  try {
    await ClassGrade.findByIdAndDelete(req.params.id);
    res.status(200).send("Class Grade deleted");
  } catch (err) {
    res.status(500).send("Error deleting Class Grade");
  }
};

// SUBJECT
exports.createSubject = async (req, res) => {
  try {
    const subject = new Subject(req.body);
    await subject.save();
    res.status(201).json(subject);
  } catch (err) {
    res.status(500).send("Error creating Subject");
  }
};

exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ name: 1 });
    res.json(subjects);
  } catch (err) {
    res.status(500).send("Error fetching Subjects");
  }
};

exports.updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(subject);
  } catch (err) {
    res.status(500).send("Error updating Subject");
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.status(200).send("Subject deleted");
  } catch (err) {
    res.status(500).send("Error deleting Subject");
  }
};
