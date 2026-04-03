import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import InputField from "../../components/form/input/InputField";

interface Teacher {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  contactNumber: string;
  qualification: string;
}

export default function TeacherList() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/teachers`, {
        headers: { Authorization: localStorage.getItem("token") || "" }
      });
      if (response.ok) {
        setTeachers(await response.json());
      }
    } catch {
      toast.error("Failed to load teachers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/teachers/${id}`, {
        method: "DELETE",
        headers: { Authorization: localStorage.getItem("token") || "" }
      });
      if (response.ok) {
        toast.success("Teacher deleted");
        fetchTeachers();
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  const filteredTeachers = teachers.filter(t => 
    `${t.firstName} ${t.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-transparent p-4 lg:p-8">
      <PageMeta title="Teacher Directory | EduSphere" description="Manage school faculty and staff" />
      <PageBreadcrumb pageTitle="Faculty Directory" />

      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <InputField
            placeholder="Search by name, dept or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => navigate("/staff/add-teacher")}>
          Register New Faculty
        </Button>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-theme-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
        <div className="overflow-x-auto text-left">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-white/[0.02]">
              <tr>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Teacher Name</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Department</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Contact Info</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Qualifications</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr><td colSpan={5} className="py-10 text-center text-gray-500">Loading directory...</td></tr>
              ) : filteredTeachers.length === 0 ? (
                <tr><td colSpan={5} className="py-10 text-center text-gray-500">No faculty members found</td></tr>
              ) : (
                filteredTeachers.map((teacher) => (
                  <tr key={teacher._id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 dark:text-white">{teacher.firstName} {teacher.lastName}</span>
                        <span className="text-xs text-gray-400">{teacher._id.slice(-6).toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge color="primary" variant="light">{teacher.department}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-sm text-gray-500">
                        <span>{teacher.email}</span>
                        <span>{teacher.contactNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium italic">
                      {teacher.qualification || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => navigate(`/staff/edit-teacher/${teacher._id}`)} className="text-brand-500 text-sm font-bold hover:underline">Profile</button>
                        <button onClick={() => handleDelete(teacher._id)} className="text-error-500 text-sm font-bold hover:underline">Remove</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
