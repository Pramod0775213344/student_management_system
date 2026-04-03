import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import DatePicker from "../../components/form/date-picker";
import Select from "../../components/form/Select";

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
}

interface AcademicYear {
  _id: string;
  name: string;
  status: string;
}

interface ClassGrade {
  _id: string;
  name: string;
  section: string;
}

export default function StudentAttendance() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [classes, setClasses] = useState<ClassGrade[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  
  const [attendanceData, setAttendanceData] = useState<Record<string, { status: string; remarks: string }>>({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const fetchInitialData = useCallback(async () => {
    try {
      const headers = { Authorization: localStorage.getItem("token") || "" };
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/academic/years`, { headers });
      if (res.ok) {
        const data = await res.json();
        setAcademicYears(data);
        const active = data.find((y: AcademicYear) => y.status === "Active");
        if (active) setSelectedYear(active._id);
      }
    } catch {
      toast.error("Failed to load sessions");
    }
  }, []);

  const fetchClasses = useCallback(async () => {
    if (!selectedYear) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/academic/classes/${selectedYear}`, {
        headers: { Authorization: localStorage.getItem("token") || "" }
      });
      if (res.ok) setClasses(await res.json());
    } catch {
      toast.error("Failed to load classes");
    }
  }, [selectedYear]);

  const fetchClassRoll = useCallback(async () => {
    if (!selectedClass || !selectedYear) return;
    setFetching(true);
    try {
      const headers = { Authorization: localStorage.getItem("token") || "" };
      
      // [1] Fetch students in this class
      const studentsRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/students?classId=${selectedClass}&academicYearId=${selectedYear}`, { headers });
      const studentsList = await studentsRes.json();
      setStudents(studentsList);

      // [2] Fetch existing attendance for this date & class
      const attendanceRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/attendance/student?date=${selectedDate}&classId=${selectedClass}`, { headers });
      const existingRecords = await attendanceRes.json();

      const newAttendance: Record<string, { status: string; remarks: string }> = {};
      studentsList.forEach((s: Student) => {
        newAttendance[s._id] = { status: "Present", remarks: "" };
      });

      existingRecords.forEach((record: any) => {
        if (record.student && record.student._id) {
          newAttendance[record.student._id] = { status: record.status, remarks: record.remarks || "" };
        }
      });

      setAttendanceData(newAttendance);
    } catch {
      toast.error("Failed to sync roll call");
    } finally {
      setFetching(false);
    }
  }, [selectedClass, selectedYear, selectedDate]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  useEffect(() => {
    fetchClassRoll();
  }, [fetchClassRoll]);

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status }
    }));
  };

  const handleSave = async () => {
    if (!selectedClass || !selectedYear) {
      toast.error("Please select session and class first");
      return;
    }
    setLoading(true);
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token") || ""
      };

      const promises = Object.entries(attendanceData).map(([studentId, data]) => {
        return fetch(`${import.meta.env.VITE_API_BASE_URL}/api/attendance/student`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            studentId,
            date: selectedDate,
            status: data.status,
            remarks: data.remarks,
            academicYearId: selectedYear,
            classId: selectedClass
          })
        });
      });

      await Promise.all(promises);
      toast.success("Register updated successfully");
    } catch {
      toast.error("Bulk mark failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent p-4 lg:p-8">
      <PageMeta title="Student Attendance | EduSphere" description="Manage student attendance records" />
      <PageBreadcrumb pageTitle="Student Roll Call" />

      <div className="mt-8 grid grid-cols-1 gap-6 mb-8 xl:grid-cols-3">
        <ComponentCard title="Context" desc="Select session and class">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Academic Year</label>
              <Select
                options={academicYears.map(y => ({ value: y._id, label: y.name }))}
                value={selectedYear}
                onChange={(val) => setSelectedYear(val)}
                placeholder="Select Year"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Class/Grade</label>
              <Select
                options={classes.map(c => ({ value: c._id, label: `${c.name} - ${c.section}` }))}
                value={selectedClass}
                onChange={(val) => setSelectedClass(val)}
                placeholder="Select Class"
                disabled={!selectedYear}
              />
            </div>
          </div>
        </ComponentCard>

        <ComponentCard title="Schedule" desc="Pick the register date">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Attendance Date</label>
              <DatePicker id="student-att-date" defaultDate={selectedDate} onChange={(_, str) => setSelectedDate(str)} />
            </div>
            <div className="pt-2">
              <Button onClick={handleSave} disabled={loading || fetching} className="w-full">
                {loading ? "Saving..." : "Submit Daily Roll Call"}
              </Button>
            </div>
          </div>
        </ComponentCard>
        
        <ComponentCard title="Summary" desc="Class status for today">
           <div className="flex flex-col h-full justify-center items-center text-center py-4">
              <p className="text-4xl font-black text-brand-500">{students.length}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Total Students Enrolled</p>
           </div>
        </ComponentCard>
      </div>

      <ComponentCard title="Student Register" desc="Mark attendance status for each student">
        {!selectedClass ? (
          <div className="py-20 text-center text-gray-400 italic">Please select a class to view the enrollment list</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-white/[0.02]">
                <tr>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Student Name</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Status</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {fetching ? (
                   <tr><td colSpan={3} className="py-12 text-center text-gray-500 italic">Syncing daily records...</td></tr>
                ) : students.length === 0 ? (
                  <tr><td colSpan={3} className="py-12 text-center text-gray-500 italic">No students found for this class in selected session</td></tr>
                ) : (
                  students.map((student) => (
                    <tr key={student._id}>
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900 dark:text-white">{student.firstName} {student.lastName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {["Present", "Absent", "Late"].map(s => (
                            <button
                              key={s}
                              onClick={() => handleStatusChange(student._id, s)}
                              className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all ${
                                attendanceData[student._id]?.status === s
                                  ? s === "Present" ? "bg-success-500 text-white shadow-lg shadow-success-500/20" 
                                    : s === "Absent" ? "bg-error-500 text-white shadow-lg shadow-error-500/20" 
                                    : "bg-warning-500 text-white shadow-lg shadow-warning-500/20"
                                  : "bg-gray-100 text-gray-400 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <input 
                          type="text"
                          placeholder="Note..."
                          className="w-full bg-transparent border-0 border-b border-gray-100 focus:border-brand-500 focus:ring-0 text-sm dark:border-gray-800 dark:text-white"
                          value={attendanceData[student._id]?.remarks || ""}
                          onChange={(e) => setAttendanceData(prev => ({
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
