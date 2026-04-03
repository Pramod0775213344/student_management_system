import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";

// Tab types system design ekata anuwa
type Tab = "overview" | "academic" | "attendance" | "fees" | "parents";

// Student data interface eka backend ekata match wenna haduwa
interface StudentData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  dob: string;
  gender: string;
  classGrade?: { _id: string; name: string; section: string };
  academicYear?: { _id: string; name: string };
  address?: string;
  admissionDate: string;
  guardianName: string;
  guardianContact: string;
  image?: string;
  attendancePercentage?: number;
  performanceGPA?: number;
}

interface PerformanceRecord {
  subject: { subjectName: string };
  marks: number;
  grade: string;
  gpa: number;
}

interface PerformanceData {
  records: PerformanceRecord[];
  cgpa: string;
  status: string;
}

interface AttendanceSummary {
  attendancePercentage: string;
  totalDays: number;
  presentDays: number;
  examEligible: boolean;
  statusMsg: string;
}

interface InvoiceData {
  _id: string;
  feeStructure: {
    name: string;
    amount: number;
  };
  dueDate: string;
  amount: number;
  paidAmount: number;
  status: string;
  lateFee: number;
}

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<StudentData | null>(null);
  const [performance, setPerformance] = useState<PerformanceData | null>(null);
  const [attendance, setAttendance] = useState<AttendanceSummary | null>(null);
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);

  // Student data load karana useEffect eka
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token") || "";
      const headers = { Authorization: token };

      try {
        const [studentRes, performanceRes, attendanceRes, feesRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/students/${id}`, { headers }),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/exams/performance/${id}`, { headers }),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/attendance/student/summary/${id}`, { headers }),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/fees/student/${id}`, { headers }),
        ]);

        if (studentRes.ok) {
          const studentData = await studentRes.json();
          setStudent(studentData);
        } else {
          toast.error("Student profile not found");
          navigate("/students/student-list");
          return;
        }

        if (performanceRes.ok) {
          const perfData = await performanceRes.json();
          setPerformance(perfData);
        }

        if (attendanceRes.ok) {
          const attData = await attendanceRes.json();
          setAttendance(attData);
        }

        if (feesRes.ok) {
          const feesData = await feesRes.json();
          setInvoices(feesData);
        }

      } catch (err) {
        console.error("Profile load error:", err);
        toast.error("Failed to load some profile data points");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAllData();
    }
  }, [id, navigate]);

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "academic", label: "Academic" },
    { key: "attendance", label: "Attendance" },
    { key: "fees", label: "Fees" },
    { key: "parents", label: "Parents" },
  ];

  // Loading state eka professional spinner ekak ekka pennawa
  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500 dark:border-gray-800"></div>
        <span className="text-sm font-medium text-gray-500">Retrieving student records...</span>
      </div>
    );
  }

  // Record ekak nathnam pennana view eka
  if (!student) return null;

  return (
    <div className="min-h-screen bg-transparent p-4 lg:p-8">
      <PageMeta
        title={`${student.firstName} ${student.lastName} | Student Profile | EduSphere`}
        description="Comprehensive official student profile view"
      />
      <PageBreadcrumb 
        pageTitle="Student Profile" 
        items={[{ label: "Student List", path: "/students/student-list" }]} 
      />

      {/* Top Profile Card - Brand design ekata match kara */}
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          {/* Avatar Area */}
          <div className="relative">
            <div className="h-24 w-24 overflow-hidden rounded-2xl border-4 border-brand-100 dark:border-brand-900/40">
              <img
                src={student.image || `https://ui-avatars.com/api/?name=${student.firstName}+${student.lastName}&background=465fff&color=fff&bold=true`}
                alt={`${student.firstName} ${student.lastName}`}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white bg-success-500 dark:border-gray-900 shadow-sm"></span>
          </div>

          {/* Core Info */}
          <div className="flex-1">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                  {student.firstName} {student.lastName}
                </h2>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {student.classGrade ? `${student.classGrade.name} - ${student.classGrade.section}` : "Unassigned Grade"} 
                  {student.academicYear && ` • ${student.academicYear.name}`} 
                  • ID: #{student._id.substring(student._id.length - 6).toUpperCase()}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <Badge size="sm" color="success">
                  Active
                </Badge>
                <button 
                  onClick={() => navigate(`/students/edit-student/${student._id}`)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-50 focus:ring-2 focus:ring-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Quick Summary Stats (Live data integration) */}
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl bg-gray-50 p-4 text-center ring-1 ring-inset ring-gray-100 dark:bg-white/[0.03] dark:ring-white/5">
                <p className="text-xl font-black text-gray-900 dark:text-white">
                  {attendance?.attendancePercentage || "0%"}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Attendance</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 text-center ring-1 ring-inset ring-gray-100 dark:bg-white/[0.03] dark:ring-white/5">
                <p className="text-xl font-black text-gray-900 dark:text-white">
                  {performance?.cgpa || "0.00"}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">CGPA</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 text-center ring-1 ring-inset ring-gray-100 dark:bg-white/[0.03] dark:ring-white/5">
                <p className="text-xl font-black text-gray-900 dark:text-white">
                  {performance?.status === "Pass" ? "A+" : "NR"}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Academic Status</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 text-center ring-1 ring-inset ring-gray-100 dark:bg-white/[0.03] dark:ring-white/5">
                <p className={`text-xl font-black ${attendance?.examEligible ? "text-success-500" : "text-error-500"}`}>
                  {attendance?.examEligible ? "Eligible" : "Ineligible"}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Exam Status</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigational Tabs */}
      <div className="mb-8 flex gap-1.5 rounded-xl border border-gray-100 bg-white p-1.5 shadow-theme-sm dark:border-white/5 dark:bg-gray-900">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-lg px-4 py-3 text-sm font-bold transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-brand-500 text-white shadow-brand-500/20"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- Tab: Overview --- */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
          {/* Detailed Personal Section */}
          <div className="rounded-2xl border border-gray-100 bg-white p-7 shadow-theme-sm dark:border-white/5 dark:bg-gray-900">
            <div className="mb-6 flex items-center justify-between">
              <h4 className="text-lg font-black text-gray-900 dark:text-white">Identity Records</h4>
              <Badge color="primary" variant="light" size="sm">Official</Badge>
            </div>
            <div className="space-y-5">
              {[
                { label: "Internal ID", value: student._id },
                { label: "Date of Birth", value: student.dob ? new Date(student.dob).toLocaleDateString("en-US", { dateStyle: "long" }) : "N/A" },
                { label: "Gender", value: student.gender },
                { label: "Registered Email", value: student.email },
                { label: "Contact Secondary", value: student.contactNumber || "None Provided" },
                { label: "Permanent Address", value: student.address || "No secondary address recorded" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-1 border-b border-gray-100 pb-4 last:border-0 dark:border-white/5">
                  <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">{item.label}</span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Records Summary */}
          <div className="rounded-2xl border border-gray-100 bg-white p-7 shadow-theme-sm dark:border-white/5 dark:bg-gray-900">
            <div className="mb-6 flex items-center justify-between">
              <h4 className="text-lg font-black text-gray-900 dark:text-white">Academic Status</h4>
              <Badge color="info" variant="light" size="sm">2024/25 Session</Badge>
            </div>
            <div className="space-y-5">
              {[
                { label: "Current Grade Level", value: student.classGrade?.name || "Not Assigned" },
                { label: "Official Section", value: student.classGrade?.section || "General" },
                { label: "Academic Year", value: student.academicYear?.name || "N/A" },
                { label: "Admission Date", value: student.admissionDate ? new Date(student.admissionDate).toLocaleDateString("en-US", { dateStyle: "long" }) : "N/A" },
                { label: "Placement Status", value: student.classGrade ? "Confirmed" : "Pending Placement" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-1 border-b border-gray-100 pb-4 last:border-0 dark:border-white/5">
                  <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">{item.label}</span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- Tab: Academic --- */}
      {activeTab === "academic" && (
        <div className="rounded-2xl border border-gray-100 bg-white p-7 shadow-theme-sm dark:border-white/5 dark:bg-gray-900">
          <h4 className="mb-6 text-lg font-black text-gray-900 dark:text-white">Subject-wise Marks</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="pb-3 text-xs font-black uppercase tracking-widest text-gray-400 py-3">Subject</th>
                  <th className="pb-3 text-xs font-black uppercase tracking-widest text-gray-400">Score</th>
                  <th className="pb-3 text-xs font-black uppercase tracking-widest text-gray-400">Grade</th>
                  <th className="pb-3 text-xs font-black uppercase tracking-widest text-gray-400">GPA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {performance?.records && performance.records.length > 0 ? (
                  performance.records.map((record, index) => (
                    <tr key={index}>
                      <td className="py-4 text-sm font-bold text-gray-800 dark:text-gray-200">
                        {record.subject?.subjectName || "Subject"}
                      </td>
                      <td className="py-4 text-sm text-gray-600 dark:text-gray-400">{record.marks}%</td>
                      <td className="py-4"><Badge size="sm" color={record.grade === "A+" ? "success" : "primary"}>{record.grade}</Badge></td>
                      <td className="py-4 text-sm font-medium text-brand-500">{record.gpa.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-sm text-gray-400">No academic records found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- Tab: Attendance --- */}
      {activeTab === "attendance" && (
        <div className="rounded-2xl border border-gray-100 bg-white p-7 shadow-theme-sm dark:border-white/5 dark:bg-gray-900">
          <h4 className="mb-6 text-lg font-black text-gray-900 dark:text-white">Attendance Summary (Last 6 Months)</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 dark:bg-white/[0.02]">
              <span className="font-bold text-gray-700 dark:text-gray-300">Total School Days</span>
              <span className="text-sm font-black text-gray-900 dark:text-white">{attendance?.totalDays || 0}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 dark:bg-white/[0.02]">
              <span className="font-bold text-gray-700 dark:text-gray-300">Days Present</span>
              <span className="text-sm font-black text-success-500">{attendance?.presentDays || 0}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 dark:bg-white/[0.02]">
              <span className="font-bold text-gray-700 dark:text-gray-300">Current Percentage</span>
              <span className={`text-sm font-black ${attendance?.examEligible ? "text-success-500" : "text-error-500"}`}>
                {attendance?.attendancePercentage || "0%"}
              </span>
            </div>
          </div>
          <div className="mt-6 rounded-xl border border-dashed border-gray-200 p-6 text-center dark:border-gray-800">
             <p className={`text-sm font-bold ${attendance?.examEligible ? "text-success-500" : "text-error-500"}`}>
                {attendance?.statusMsg || "No attendance records available for eligibility check."}
             </p>
          </div>
        </div>
      )}

      {/* --- Tab: Fees --- */}
      {activeTab === "fees" && (
        <div className="rounded-2xl border border-gray-100 bg-white p-7 shadow-theme-sm dark:border-white/5 dark:bg-gray-900">
          <h4 className="mb-6 text-lg font-black text-gray-900 dark:text-white">Invoice History</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="pb-3 text-xs font-black uppercase tracking-widest text-gray-400 py-3">Invoice #</th>
                  <th className="pb-3 text-xs font-black uppercase tracking-widest text-gray-400">Date</th>
                  <th className="pb-3 text-xs font-black uppercase tracking-widest text-gray-400">Amount</th>
                  <th className="pb-3 text-xs font-black uppercase tracking-widest text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {invoices && invoices.length > 0 ? (
                  invoices.map((inv) => (
                    <tr key={inv._id}>
                      <td className="py-4 text-sm font-bold text-gray-800 dark:text-gray-200">
                        {inv._id.substring(inv._id.length - 8).toUpperCase()}
                      </td>
                      <td className="py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(inv.dueDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 text-sm font-black text-gray-900 dark:text-white">
                        Rs. {(inv.amount + (inv.lateFee || 0)).toLocaleString()}
                      </td>
                      <td className="py-4"><Badge size="sm" color={inv.status === "Paid" ? "success" : "error"}>{inv.status}</Badge></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-sm text-gray-400">No invoice history found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- Tab: Parents --- */}
      {activeTab === "parents" && (
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-7 shadow-theme-sm dark:border-white/5 dark:bg-gray-900">
            <div className="mb-6 flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-500 dark:bg-brand-500/10">
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h5 className="text-xl font-black text-gray-900 dark:text-white">{student.guardianName}</h5>
                <Badge size="sm" color="primary">Primary Guardian</Badge>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-4 dark:bg-white/[0.02]">
                <div className="text-brand-500">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Emergency Phone</p>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{student.guardianContact}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-4 dark:bg-white/[0.02]">
                <div className="text-brand-500">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Residential Address</p>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{student.address || "Same as student records"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-7 text-center dark:border-white/10 dark:bg-gray-900">
            <p className="text-sm font-medium text-gray-400">No secondary guardian records found for this student.</p>
          </div>
        </div>
      )}
    </div>
  );
}
