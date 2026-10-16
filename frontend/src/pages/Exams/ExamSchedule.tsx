import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import InputField from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import Badge from "../../components/ui/badge/Badge";

interface AcademicYear {
  _id: string;
  name: string;
}

interface Exam {
  _id: string;
  name: string;
  academicYear: AcademicYear | string | null;
  startDate: string;
  endDate: string;
  status: "Upcoming" | "Ongoing" | "Completed" | "Cancelled";
}

export default function ExamSchedule() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";

  const [exams, setExams] = useState<Exam[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    academicYear: "",
    startDate: "",
    endDate: "",
  });

  const fetchData = useCallback(async () => {
    setFetching(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: token ? `Bearer ${token}` : "" };
      
      const [yearsRes, examsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/academic/years`, { headers }),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/exams`, { headers })
      ]);

      if (yearsRes.ok) {
        setAcademicYears(await yearsRes.json());
      }
      
      if (examsRes.ok) {
        setExams(await examsRes.json());
      } else if (examsRes.status === 403) {
        toast.error("You don't have permission to view exams");
      }
    } catch {
      toast.error("Network error: Failed to load exam schedules");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.academicYear || !formData.startDate || !formData.endDate) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/exams/schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success("Exam scheduled successfully");
        setFormData({ name: "", academicYear: "", startDate: "", endDate: "" });
        fetchData();
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to save schedule");
      }
    } catch {
      toast.error("An error occurred during submission");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "TBD";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "TBD" : date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-transparent p-4 lg:p-8">
      <PageMeta title="Exam Schedule | EduSphere" description="Manage academic examination schedules" />
      <PageBreadCrumb pageTitle="Academic Examinations" />

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Creation Form - Admin Only */}
        {isAdmin && (
          <div className="xl:col-span-1">
            <ComponentCard title="Create New Exam" desc="Define a new assessment term">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block text-gray-700 dark:text-gray-300">Exam Session Name</label>
                  <InputField
                    placeholder="e.g., First Term Final"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block text-gray-700 dark:text-gray-300">Academic Year</label>
                  <Select
                    options={academicYears.map(y => ({ value: y._id, label: y.name }))}
                    value={formData.academicYear}
                    onChange={(val) => setFormData({ ...formData, academicYear: val })}
                    placeholder="Select Year"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block text-gray-700 dark:text-gray-300">Start Date</label>
                    <InputField
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block text-gray-700 dark:text-gray-300">End Date</label>
                    <InputField
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Scheduling..." : "Create Schedule"}
                  </Button>
                </div>
              </form>
            </ComponentCard>
          </div>
        )}

        {/* Existing Schedules Table */}
        <div className={isAdmin ? "xl:col-span-2" : "xl:col-span-3"}>
          <ComponentCard title="Active & Upcoming Exams" desc="Global academic evaluation timeline">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-white/[0.02]">
                  <tr>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Exam Session</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Session</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Duration</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {fetching ? (
                    <tr><td colSpan={4} className="py-12 text-center text-gray-500 italic text-sm">Syncing academic timeline...</td></tr>
                  ) : exams.length === 0 ? (
                    <tr><td colSpan={4} className="py-12 text-center text-gray-500 italic text-sm">No exam sessions scheduled yet</td></tr>
                  ) : (
                    exams.map((exam) => (
                      <tr key={exam._id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors">
                        <td className="px-6 py-4">
                           <p className="font-bold text-gray-900 dark:text-white">{exam.name}</p>
                        </td>
                        <td className="px-6 py-4">
                           <span className="text-sm text-gray-500 dark:text-gray-400">
                              {typeof exam.academicYear === 'object' ? exam.academicYear?.name : "N/A"}
                           </span>
                        </td>
                        <td className="px-6 py-4">
                           <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                              {formatDate(exam.startDate)} - {formatDate(exam.endDate)}
                           </p>
                        </td>
                        <td className="px-6 py-4">
                          <Badge 
                            size="sm" 
                            color={
                              exam.status === "Ongoing" ? "success" : 
                              exam.status === "Completed" ? "primary" : 
                              exam.status === "Cancelled" ? "error" : "warning"
                            }
                          >
                            {exam.status || "Upcoming"}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}


