import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { toast } from "react-hot-toast";

interface ReportCardRecord {
  _id: string;
  subject: {
    subjectName: string;
    subjectCode: string;
  };
  exam: {
    examName: string;
    description: string;
  };
  marks: number;
  grade: string;
  gpa: number;
  remarks: string;
}

export default function ReportCards() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [reportData, setReportData] = useState<ReportCardRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [cgpa, setCgpa] = useState("0.00");
  const [studentInfo, setStudentInfo] = useState({ name: "", id: "", class: "Grade 10-A" });

  useEffect(() => {
    const fetchReport = async () => {
      if (!user.studentId && user.role === "student") {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Only student report card fetching logic for now. 
        // Admin/Teacher will need a student selector.
        const studentId = user.role === "student" ? user.studentId : ""; 
        if (!studentId) {
            setLoading(false);
            return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/exams/report-card/${studentId}`, {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        const data = await response.json();

        setReportData(data.records || []);
        setCgpa(data.cgpa || "0.00");
        if (data.records && data.records.length > 0) {
            const first = data.records[0].student;
            setStudentInfo(prev => ({ 
                ...prev, 
                name: `${first.firstName} ${first.lastName}`, 
                id: first.studentID 
            }));
        }
      } catch {
        toast.error("Failed to generate report card");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [user.studentId, user.role]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
     return (
       <div className="flex h-96 items-center justify-center">
         <div className="size-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
       </div>
     );
  }

  return (
    <div className="space-y-6">
      <PageMeta title="Report Card | EduSphere" description="Official academic report card" />
      <div className="flex items-center justify-between">
         <PageBreadcrumb pageTitle="Official Report Card" />
         <button 
           onClick={handlePrint}
           className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 shadow-sm print:hidden"
         >
           <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 012-2H7a2 2 0 012 2v4a2 2 0 002 2z" />
           </svg>
           Download PDF / Print
         </button>
      </div>

      {reportData.length > 0 ? (
        <div id="printable-report" className="mx-auto w-full max-w-[900px] overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-white/[0.03] print:shadow-none print:border-none">
          {/* School Header */}
          <div className="bg-brand-500 p-10 text-white text-center print:bg-white print:text-black">
             <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                <img src="/images/logo/logo-icon.svg" alt="EduSphere" className="size-12 brightness-0 invert" />
             </div>
             <h2 className="text-3xl font-black uppercase tracking-tighter italic">EduSphere <span className="font-light">Academic Institute</span></h2>
             <p className="mt-2 text-sm font-medium opacity-80 uppercase tracking-widest">Official Academic Performance Certificate</p>
          </div>

          {/* Student Info Bar */}
          <div className="grid grid-cols-2 gap-8 border-b border-gray-100 bg-gray-50/50 p-8 dark:border-gray-800 dark:bg-transparent sm:grid-cols-4">
             <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Student Name</p>
                <p className="mt-1 font-bold text-gray-800 dark:text-white/90">{studentInfo.name || "N/A"}</p>
             </div>
             <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Student ID</p>
                <p className="mt-1 font-bold text-gray-800 dark:text-white/90 uppercase">{studentInfo.id || "N/A"}</p>
             </div>
             <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Class / Grade</p>
                <p className="mt-1 font-bold text-gray-800 dark:text-white/90">{studentInfo.class}</p>
             </div>
             <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Term Period</p>
                <p className="mt-1 font-bold text-gray-800 dark:text-white/90">Autumn 2024</p>
             </div>
          </div>

          {/* Marks Table */}
          <div className="p-8">
             <table className="w-full text-left">
                <thead>
                   <tr className="border-b-2 border-gray-900 pb-2 dark:border-white">
                      <th className="pb-4 text-xs font-black uppercase tracking-widest text-gray-800 dark:text-white/90">Subject Details</th>
                      <th className="pb-4 text-center text-xs font-black uppercase tracking-widest text-gray-800 dark:text-white/90">Marks</th>
                      <th className="pb-4 text-center text-xs font-black uppercase tracking-widest text-gray-800 dark:text-white/90">Grade</th>
                      <th className="pb-4 text-right text-xs font-black uppercase tracking-widest text-gray-800 dark:text-white/90">GPA</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                   {reportData.map((record) => (
                      <tr key={record._id} className="group">
                         <td className="py-6">
                            <p className="font-bold text-gray-900 dark:text-white">{record.subject.subjectName}</p>
                            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">{record.subject.subjectCode}</p>
                         </td>
                         <td className="py-6 text-center">
                            <span className="text-lg font-black text-gray-900 dark:text-white">{record.marks}</span>
                            <span className="ml-1 text-[10px] font-bold opacity-30">/ 100</span>
                         </td>
                         <td className="py-6 text-center">
                            <div className="mx-auto flex size-10 items-center justify-center rounded-xl border border-gray-900 font-black dark:border-white">
                               {record.grade}
                            </div>
                         </td>
                         <td className="py-6 text-right font-mono font-bold text-brand-500">
                            {record.gpa.toFixed(2)}
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>

             {/* Summary Footer */}
             <div className="mt-12 flex flex-col sm:flex-row sm:items-end justify-between gap-8 border-t-4 border-gray-900 pt-8 dark:border-white">
                <div className="space-y-4">
                   <div className="flex items-center gap-10">
                      <div>
                         <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Overall CGPA</p>
                         <p className="text-4xl font-black text-gray-900 dark:text-white italic tracking-tighter">{cgpa}</p>
                      </div>
                      <div className="h-10 w-[1px] bg-gray-200 dark:bg-gray-700" />
                      <div>
                         <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Result Status</p>
                         <p className={`text-xl font-bold uppercase tracking-wider ${parseFloat(cgpa) >= 2.0 ? "text-emerald-500" : "text-rose-500"}`}>
                            {parseFloat(cgpa) >= 2.0 ? "Pass (Qualified)" : "Fail (Requires Review)"}
                         </p>
                      </div>
                   </div>
                </div>

                <div className="text-right flex flex-col items-end gap-1">
                   <div className="h-[2px] w-48 bg-gray-900 dark:bg-white mt-8 mb-2" />
                   <p className="text-xs font-black uppercase tracking-widest">Office of the Registrar</p>
                   <p className="text-[10px] font-medium text-gray-400 italic">This is an electronically generated official document.</p>
                </div>
             </div>
          </div>

          <div className="bg-gray-900 p-4 text-center text-[10px] font-bold uppercase tracking-widest text-white/40 dark:bg-white/5">
             © 2024 EduSphere Academic Management Suite • Education Reimagined
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-96 p-10 bg-white rounded-2xl border border-gray-200 dark:bg-white/5 dark:border-gray-800">
           <svg className="size-16 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
           </svg>
           <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">No Official Records</h3>
           <p className="text-sm text-gray-500 max-w-xs text-center">Your formal report card hasn't been generated yet for the current term.</p>
        </div>
      )}
    </div>
  );
}
