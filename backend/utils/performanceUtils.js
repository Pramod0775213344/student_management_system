/**
 * Calculate GPA from marks based on standard school grading
 * @param {number} marks - Student marks (0-100)
 * @returns {object} { gpa, grade }
 */
exports.calculateGPA = (marks) => {
  if (marks >= 90) return { gpa: 4.0, grade: "A+" };
  if (marks >= 80) return { gpa: 3.7, grade: "A" };
  if (marks >= 70) return { gpa: 3.3, grade: "B+" };
  if (marks >= 60) return { gpa: 3.0, grade: "B" };
  if (marks >= 50) return { gpa: 2.7, grade: "C+" };
  if (marks >= 40) return { gpa: 2.0, grade: "C" };
  return { gpa: 0.0, grade: "F" };
};

/**
 * Calculate Attendance Percentage
 * @param {number} totalDays - Total academic days
 * @param {number} presentDays - Days the student was present
 * @returns {number} Percentage (0-100)
 */
exports.calculateAttendancePercentage = (totalDays, presentDays) => {
  if (totalDays === 0) return 0;
  return Math.round((presentDays / totalDays) * 100);
};

/**
 * Check Exam Eligibility based on 75% rule
 * @param {number} percentage - Current attendance percentage
 * @returns {boolean}
 */
exports.isEligibleForExams = (percentage) => {
  return percentage >= 75;
};
