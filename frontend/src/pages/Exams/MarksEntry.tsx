import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import Select from "../../components/form/Select";
import InputField from "../../components/form/input/InputField";

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
}

interface MarkInput {
  student: string;
  marks: number;
  remarks: string;
}

interface Assignment {
  subject: { _id: string; subjectName: string };
  classGrade: { _id: string; className: string; section: string };
}

interface AcademicYear {
  _id: string;
  name: string;
  status: string;
}

interface Exam {
  _id: string;
  name: string;
}

interface ClassData {
  _id: string;
  className: string;
  section: string;
}

interface Subject {
  _id: string;
  subjectName: string;
}

export default function MarksEntry() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isTeacher = user.role === "teacher";

  // Context States
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  // Data States
  const [students, setStudents] = useState<Student[]>([]);
  const [marksData, setMarksData] = useState<Record<string, MarkInput>>({});
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const fetchInitialData = useCallback(async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
      const [yearRes, examRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/academic/years`, { headers }),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/exams`, { headers })
      ]);
      
      if (yearRes.ok) {
        const yData = await yearRes.json();
        setAcademicYears(yData);
        const active = yData.find((y: AcademicYear) => y.status === "Active");
        if (active) setSelectedYear(active._id);
      }
      if (examRes.ok) setExams(await examRes.json());

      // If teacher, fetch their specific assignments
      if (isTeacher && user.teacherId) {
          const assignRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/exams/teacher-results/${user.teacherId}`, { headers });
          if (assignRes.ok) {
              const data = await assignRes.json();
              setAssignments(data.assignments || []);
          }
      }
    } catch {
      toast.error("Failed to load setup data");
    }
  }, [isTeacher, user.teacherId]);

  const fetchGlobalContext = useCallback(async () => {
    if (!selectedYear || isTeacher) return; // Teachers use assignments
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
      const [classRes, subRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/academic/classes/${selectedYear}`, { headers }),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/academic/subjects`, { headers })
      ]);
      if (classRes.ok) setClasses(await classRes.json());
      if (subRes.ok) setSubjects(await subRes.json());
    } catch {
      toast.error("Failed to load academic context");
    }
  }, [selectedYear, isTeacher]);

  const fetchResultSheet = useCallback(async () => {
    if (!selectedClass || !selectedSubject || !selectedExam) return;
    setFetching(true);
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
      
      // [1] Get all students in this class
      const studentRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/students?classId=${selectedClass}&academicYearId=${selectedYear}`, { headers });
      const studentList = await studentRes.json();
      setStudents(studentList);

      // [2] Get existing marks for this exam + subject
      const markRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/exams/marks?exam=${selectedExam}&subject=${selectedSubject}`, { headers });
      const existingMarks = await markRes.json();

      const newMarks: Record<string, MarkInput> = {};
      studentList.forEach((s: Student) => {
        newMarks[s._id] = { student: s._id, marks: 0, remarks: "" };
      });

      existingMarks.forEach((m: { student: { _id?: string } | string; marks: number; remarks: string }) => {
        const sId = typeof m.student === 'string' ? m.student : m.student?._id;
        if (sId && newMarks[sId]) {
          newMarks[sId] = { 
            student: sId, 
            marks: m.marks || 0, 
            remarks: m.remarks || "" 
          };
        }
      });

      setMarksData(newMarks);
    } catch {
      toast.error("Failed to fetch result sheet");
    } finally {
      setFetching(false);
    }
  }, [selectedClass, selectedSubject, selectedExam, selectedYear]);

  useEffect(() => { fetchInitialData(); }, [fetchInitialData]);
  useEffect(() => { fetchGlobalContext(); }, [fetchGlobalContext]);
  useEffect(() => { fetchResultSheet(); }, [fetchResultSheet]);

  const handleMarkChange = (studentId: string, val: string) => {
    const num = parseInt(val) || 0;
    if (num < 0 || num > 100) return;
    setMarksData(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], marks: num }
    }));
  };

  const handleSubmit = async () => {
    if (!selectedExam || !selectedSubject) {
      toast.error("Invalid context selection");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/exams/marks/batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          exam: selectedExam,
          subject: selectedSubject,
          records: Object.values(marksData)
        })
      });

      if (res.ok) {
        toast.success("Marks submitted successfully");
      } else {
        toast.error("Submission failed");
      }
    } catch {
      toast.error("Network error during submission");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent p-4 lg:p-8">
      <PageMeta title="Marks Entry | EduSphere" description="Faculty grading portal" />
      <PageBreadcrumb pageTitle="Results Grading Board" />

      <div className="mt-8 grid grid-cols-1 gap-6 mb-8 lg:grid-cols-4">
        <ComponentCard title="Evaluation Context" desc="Pick the session and exam">
           <div className="space-y-4">
              <Select 
                placeholder="Session" 
                value={selectedYear} 
                onChange={setSelectedYear} 
                options={academicYears.map(y => ({ value: y._id, label: y.name }))} 
              />
              <Select 
                placeholder="Exam Session" 
                value={selectedExam} 
                onChange={setSelectedExam} 
                options={exams.map(e => ({ value: e._id, label: e.name }))} 
              />
           </div>
        </ComponentCard>
        
        <ComponentCard title="Target Group" desc="Select class and subject">
           <div className="space-y-4">
              {isTeacher ? (
                <>
                  <Select 
                    placeholder="My Classes" 
                    value={selectedClass} 
                    onChange={setSelectedClass} 
                    options={Array.from(new Set(assignments.map(a => a.classGrade._id))).map(id => {
                        const a = assignments.find(as => as.classGrade._id === id);
                        return { value: id, label: `${a?.classGrade.className} - ${a?.classGrade.section}` };
                    })} 
                  />
                  <Select 
                    placeholder="My Subjects" 
                    value={selectedSubject} 
                    onChange={setSelectedSubject} 
                    options={assignments.filter(a => a.classGrade._id === selectedClass).map(a => ({ value: a.subject._id, label: a.subject.subjectName }))} 
                  />
                </>
              ) : (
                <>
                  <Select 
                    placeholder="Class/Grade" 
                    value={selectedClass} 
                    onChange={setSelectedClass} 
                    options={classes.map(c => ({ value: c._id, label: `${c.className} - ${c.section}` }))} 
                  />
                  <Select 
                    placeholder="Subject" 
                    value={selectedSubject} 
                    onChange={setSelectedSubject} 
                    options={subjects.map(s => ({ value: s._id, label: s.subjectName }))} 
                  />
                </>
              )}
           </div>
        </ComponentCard>

        <ComponentCard title="Actions" desc="Save class results">
           <div className="flex flex-col h-full justify-center gap-3">
              <p className="text-xs text-gray-400 font-bold uppercase text-center">Batch Processing</p>
              <Button onClick={handleSubmit} disabled={loading || fetching} className="w-full">
                {loading ? "Submitting..." : "Submit Mark Sheet"}
              </Button>
           </div>
        </ComponentCard>

        <ComponentCard title="Quick Stats" desc="Data completeness">
           <div className="text-center py-2">
              <p className="text-3xl font-black text-brand-500">{students.length}</p>
              <p className="text-[10px] uppercase font-bold text-gray-400">Enrolled Students</p>
           </div>
        </ComponentCard>
      </div>

      <ComponentCard title="Result Sheet" desc="Enter raw marks (0-100) per student">
        {!selectedSubject || !selectedClass || !selectedExam ? (
          <div className="py-20 text-center text-gray-400 italic">Please complete the evaluation context to unlock the mark sheet</div>
        ) : (
          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-white/[0.02]">
                   <tr>
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Student Name</th>
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Raw Marks</th>
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-400 w-1/3">Feedback/Remarks</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                   {fetching ? (
                      <tr><td colSpan={3} className="py-12 text-center text-gray-500 italic">Downloading result sheet...</td></tr>
                   ) : students.length === 0 ? (
                      <tr><td colSpan={3} className="py-12 text-center text-gray-500 italic">No students found in this class</td></tr>
                   ) : (
                      students.map((student) => (
                        <tr key={student._id}>
                           <td className="px-6 py-4">
                              <span className="font-bold text-gray-900 dark:text-white">{student.firstName} {student.lastName}</span>
                           </td>
                           <td className="px-6 py-4">
                              <div className="w-32">
                                <InputField 
                                  type="number"
                                  placeholder="0-100"
                                  value={marksData[student._id]?.marks || ""}
                                  onChange={(e) => handleMarkChange(student._id, e.target.value)}
                                />
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <input 
                                type="text"
                                placeholder="Teacher remarks..."
                                className="w-full bg-transparent border-0 border-b border-gray-100 focus:border-brand-500 focus:ring-0 text-sm dark:border-gray-800 dark:text-white"
                                value={marksData[student._id]?.remarks || ""}
                                onChange={(e) => setMarksData(prev => ({
                                  ...prev,
                                  [student._id]: { ...prev[student._id], remarks: e.target.value }
                                }))}
                              />
                           </td>
                        </tr>
                      ))
                   )}
                </tbody>
             </table>
          </div>
        )}
      </ComponentCard>
    </div>
  );
}
