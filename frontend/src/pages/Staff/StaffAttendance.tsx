import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import DatePicker from "../../components/form/date-picker";
import Badge from "../../components/ui/badge/Badge";

interface APIItem {
  _id: string;
  [key: string]: any;
}

export default function StaffAttendance() {
  const [teachers, setTeachers] = useState<APIItem[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceData, setAttendanceData] = useState<Record<string, { status: string; remarks: string }>>({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const fetchData = useCallback(async () => {
    setFetching(true);
    try {
      const headers = { Authorization: localStorage.getItem("token") || "" };
      // [1] Fetch all teachers
      const teachersRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/teachers`, { headers });
      const teachersList = await teachersRes.json();
      setTeachers(teachersList);

      // [2] Fetch existing attendance for this date
      const attendanceRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/attendance/staff?date=${selectedDate}`, { headers });
      const existingRecords = await attendanceRes.json();

      const newAttendance: Record<string, { status: string; remarks: string }> = {};
      // default status = Present for all
      teachersList.forEach((t: APIItem) => {
        newAttendance[t._id] = { status: "Present", remarks: "" };
      });

      // overwrite with existing
      existingRecords.forEach((record: any) => {
        if (record.staff && record.staff._id) {
          newAttendance[record.staff._id] = { status: record.status, remarks: record.remarks || "" };
        }
      });

      setAttendanceData(newAttendance);
    } catch {
      toast.error("Failed to sync attendance data");
    } finally {
      setFetching(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusChange = (staffId: string, status: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [staffId]: { ...prev[staffId], status }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token") || ""
      };

      const promises = Object.entries(attendanceData).map(([staffId, data]) => {
        return fetch(`${import.meta.env.VITE_API_BASE_URL}/api/attendance/staff`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            staffId,
            date: selectedDate,
            status: data.status,
            remarks: data.remarks
          })
        });
      });

      await Promise.all(promises);
      toast.success("Attendance updated for " + selectedDate);
    } catch {
      toast.error("Batch update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent p-4 lg:p-8">
      <PageMeta title="Staff Attendance | EduSphere" description="Manage faculty attendance records" />
      <PageBreadcrumb pageTitle="Faculty Attendance Register" />

      <div className="mt-8 flex flex-col items-start md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="w-full max-w-xs">
          <label className="text-sm font-semibold mb-2 block text-gray-700 dark:text-gray-300">Register Date</label>
          <DatePicker 
            id="register-date"
            defaultDate={selectedDate} 
            onChange={(_, dateStr) => setSelectedDate(dateStr)} 
          />
        </div>
        <Button onClick={handleSave} disabled={loading || fetching}>
          {loading ? "Updating..." : "Save Daily Register"}
        </Button>
      </div>

      <ComponentCard title="Staff Roll Call" desc="Mark attendance for all faculty members">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-white/[0.02]">
              <tr>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Faculty Member</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Department</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Attendance Status</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {fetching ? (
                <tr><td colSpan={4} className="py-12 text-center text-gray-500 italic">Syncing daily records...</td></tr>
              ) : teachers.length === 0 ? (
                <tr><td colSpan={4} className="py-12 text-center text-gray-500 italic">No faculty members found in directory</td></tr>
              ) : (
                teachers.map((teacher) => (
                  <tr key={teacher._id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01]">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 dark:text-white">{teacher.firstName} {teacher.lastName}</span>
                        <span className="text-xs text-gray-400">Faculty ID: {teacher._id.slice(-6).toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="light" color="primary">{teacher.department}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {["Present", "Absent", "Late"].map(s => (
                          <button
                            key={s}
                            onClick={() => handleStatusChange(teacher._id, s)}
                            className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all ${
                              attendanceData[teacher._id]?.status === s
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
                        placeholder="Add note..."
                        className="w-full bg-transparent border-0 border-b border-gray-200 focus:border-brand-500 focus:ring-0 text-sm dark:border-gray-800 dark:text-white"
                        value={attendanceData[teacher._id]?.remarks || ""}
                        onChange={(e) => setAttendanceData(prev => ({
                          ...prev,
                          [teacher._id]: { ...prev[teacher._id], remarks: e.target.value }
                        }))}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </ComponentCard>
    </div>
  );
}
