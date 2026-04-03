import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import Select from "../../components/form/Select";

interface Assignment {
  _id: string;
  teacher: { _id: string; firstName: string; lastName: string };
  classGrade: { _id: string; name: string; section: string };
  subject: { _id: string; name: string; code: string };
  academicYear: { _id: string; name: string };
}

interface APIItem {
  _id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  code?: string;
  section?: string;
  department?: string;
  status?: string;
}

export default function AssignSubjects() {
  const [academicYears, setAcademicYears] = useState<APIItem[]>([]);
  const [classes, setClasses] = useState<APIItem[]>([]);
  const [subjects, setSubjects] = useState<APIItem[]>([]);
  const [teachers, setTeachers] = useState<APIItem[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [formData, setFormData] = useState({ subject: "", teacher: "" });
  const [loading, setLoading] = useState(false);

  const fetchInitialData = useCallback(async () => {
    try {
      const headers = { Authorization: localStorage.getItem("token") || "" };
      const [yearsRes, subjectsRes, teachersRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/academic/years`, { headers }),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/academic/subjects`, { headers }),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/teachers`, { headers }),
      ]);

      if (yearsRes.ok) {
        const yearsData = await yearsRes.json();
        setAcademicYears(yearsData);
        const active = yearsData.find((y: APIItem) => y.status === "Active");
        if (active) setSelectedYear(active._id);
      }
      if (subjectsRes.ok) setSubjects(await subjectsRes.json());
      if (teachersRes.ok) setTeachers(await teachersRes.json());
    } catch {
      toast.error("Failed to load setup data");
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const fetchClasses = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/academic/classes/${selectedYear}`, {
        headers: { Authorization: localStorage.getItem("token") || "" }
      });
      if (res.ok) setClasses(await res.json());
    } catch {
      toast.error("Failed to load classes");
    }
  }, [selectedYear]);

  useEffect(() => {
    if (selectedYear) fetchClasses();
  }, [selectedYear, fetchClasses]);

  const fetchAssignments = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/teachers/assignments?classId=${selectedClass}&academicYearId=${selectedYear}`, {
        headers: { Authorization: localStorage.getItem("token") || "" }
      });
      if (res.ok) setAssignments(await res.json());
    } catch {
      toast.error("Failed to fetch current assignments");
    }
  }, [selectedClass, selectedYear]);

  useEffect(() => {
    if (selectedClass && selectedYear) fetchAssignments();
  }, [selectedClass, selectedYear, fetchAssignments]);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedYear || !selectedClass || !formData.subject || !formData.teacher) {
      toast.error("Please select all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/teachers/assignments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token") || ""
        },
        body: JSON.stringify({
          academicYearId: selectedYear,
          classId: selectedClass,
          subjectId: formData.subject,
          teacherId: formData.teacher
        })
      });

      if (res.ok) {
        toast.success("Subject Assigned Successfully");
        setFormData({ subject: "", teacher: "" });
        fetchAssignments();
      } else {
        const err = await res.json();
        toast.error(err.message || "Assignment failed");
      }
    } catch {
      toast.error("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!window.confirm("Remove this assignment?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/teachers/assignments/${id}`, {
        method: "DELETE",
        headers: { Authorization: localStorage.getItem("token") || "" }
      });
      if (res.ok) {
        toast.success("Assignment removed");
        fetchAssignments();
      }
    } catch {
      toast.error("Failed to remove assignment");
    }
  };

  return (
    <div className="min-h-screen bg-transparent p-4 lg:p-8">
      <PageMeta title="Assign Subjects | EduSphere" description="Link teachers to subjects and classes" />
      <PageBreadcrumb pageTitle="Subject Assignments" />

      <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-12">
        <div className="xl:col-span-12">
          <ComponentCard title="Context Selection" desc="Select session and class to manage assignments">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Academic Session</label>
                <Select
                  options={academicYears.map(y => ({ value: y._id, label: y.name || "" }))}
                  value={selectedYear}
                  onChange={(val) => setSelectedYear(val)}
                  placeholder="Select Session"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Target Class</label>
                <Select
                  options={classes.map(c => ({ value: c._id, label: `${c.name} - ${c.section}` }))}
                  value={selectedClass}
                  onChange={(val) => setSelectedClass(val)}
                  placeholder="Select Class"
                />
              </div>
            </div>
          </ComponentCard>
        </div>

        <div className="xl:col-span-4">
          <ComponentCard title="New Assignment" desc="Link a subject to a faculty member">
            <form onSubmit={handleAssign} className="space-y-5">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Subject</label>
                <Select
                  options={subjects.map(s => ({ value: s._id, label: `${s.name} (${s.code})` }))}
                  value={formData.subject}
                  onChange={(val) => setFormData(p => ({ ...p, subject: val }))}
                  placeholder="Select Subject"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Assigned Teacher</label>
                <Select
                  options={teachers.map(t => ({ value: t._id, label: `${t.firstName} ${t.lastName} (${t.department})` }))}
                  value={formData.teacher}
                  onChange={(val) => setFormData(p => ({ ...p, teacher: val }))}
                  placeholder="Select Teacher"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Assigning..." : "Add Assignment"}
              </Button>
            </form>
          </ComponentCard>
        </div>

        <div className="xl:col-span-8">
          <ComponentCard title="Class Registry" desc="Current subject-teacher mapping for selected class">
            {!selectedClass ? (
              <div className="py-12 text-center text-gray-500 italic">Please select a class to view assignments</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-white/[0.02]">
                    <tr>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">Subject</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">Faculty Member</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-400 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {assignments.length === 0 ? (
                      <tr><td colSpan={3} className="py-8 text-center text-sm text-gray-500">No subjects assigned yet</td></tr>
                    ) : (
                      assignments.map((item) => (
                        <tr key={item._id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01]">
                          <td className="px-4 py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-900 dark:text-white">{item.subject?.name || "Missing Subject"}</span>
                              <span className="text-xs text-gray-400 font-mono">{item.subject?.code || "N/A"}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {item.teacher ? `${item.teacher.firstName} ${item.teacher.lastName}` : "Deleted Staff"}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <button onClick={() => handleRemove(item._id)} className="text-error-500 hover:text-error-600 font-bold text-sm">Remove</button>
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
      </div>
    </div>
  );
}
