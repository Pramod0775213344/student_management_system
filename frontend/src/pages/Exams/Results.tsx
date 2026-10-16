import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { toast } from "react-hot-toast";

// Professional Grade Colors
const gradeColors: Record<string, string> = {
  A: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  B: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  C: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  S: "bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20",
  F: "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
};

interface ResultRecord {
  _id: string;
  student: {
    firstName: string;
    lastName: string;
    studentID: string;
  };
  subject: {
    subjectName: string;
    subjectCode: string;
  };
  exam: {
    examName: string;
  };
  marks: number;
  grade: string;
  gpa: number;
  remarks: string;
}

export default function Results() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = user.role;
  const isStudent = userRole === "student";
  const isTeacher = userRole === "teacher";
  const isAdmin = userRole === "admin";

  const [results, setResults] = useState<ResultRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [cgpa, setCgpa] = useState("0.00");

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        let endpoint = "";
        if (isStudent && user.studentId) {
          endpoint = `/api/exams/report-card/${user.studentId}`;
        } else if (isTeacher && user.teacherId) {
          endpoint = `/api/exams/teacher-results/${user.teacherId}`;
        } else if (isAdmin) {
          endpoint = `/api/exams/marks`; // Admins get global marks by default or via filter
        }

        if (!endpoint) return;

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        const data = await response.json();

        if (isStudent) {
            setResults(data.records || []);
            setCgpa(data.cgpa || "0.00");
        } else if (isTeacher) {
            setResults(data.marks || []);
        } else {
            setResults(data || []);
        }
      } catch {
        toast.error("Failed to load results data");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [isStudent, isTeacher, isAdmin, user.studentId, user.teacherId]);

  return (
    <div className="space-y-6">
      <PageMeta title="Results Dashboard | EduSphere" description="View academic performance and results" />
      <PageBreadcrumb pageTitle="Academic Results" />

      {/* Overview Cards (For Student) */}
      {isStudent && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current CGPA</p>
            <h4 className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">{cgpa}</h4>
            <div className="mt-4 flex items-center text-xs font-medium text-emerald-500">
              <span className="mr-1">Academic Year: 2024</span>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Subjects</p>
            <h4 className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">{results.length}</h4>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
            <h4 className={`mt-2 text-2xl font-bold ${parseFloat(cgpa) >= 2.0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {parseFloat(cgpa) >= 2.0 ? 'Excellence' : 'Improvement'}
            </h4>
          </div>
        </div>
      )}

      {/* Main Results Table */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="px-5 py-6 sm:px-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {isStudent ? "My Performance Records" : isTeacher ? "Subject Performance (Assigned)" : "Global Results Management"}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            A comprehensive list of all academic records and grades.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                {!isStudent && (
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Student</th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Exam</th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">Marks</th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center">
                    <div className="flex justify-center">
                       <div className="size-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
                    </div>
                  </td>
                </tr>
              ) : results.length > 0 ? (
                results.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01]">
                    {!isStudent && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {record.student.firstName} {record.student.lastName}
                        <br/><span className="text-xs text-gray-400">{record.student.studentID}</span>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {record.subject.subjectName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {record.exam.examName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-gray-900 dark:text-white">
                      {record.marks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${gradeColors[record.grade] || gradeColors.Default}`}>
                        {record.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm italic text-gray-500">
                      {record.remarks || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    No result records found for your account.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
