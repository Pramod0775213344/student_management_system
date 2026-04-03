import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import InputField from "../../components/form/input/InputField";
import { toast } from "react-hot-toast";

interface Subject {
  _id: string;
  name: string;
  code: string;
  type: "Core" | "Elective";
  description?: string;
  creditHours?: number;
  department?: string;
}

export default function Subjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    code: string;
    type: "Core" | "Elective";
    description: string;
    creditHours: number;
    department: string;
  }>({
    name: "",
    code: "",
    type: "Core",
    description: "",
    creditHours: 3,
    department: ""
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/academic/subjects`, {
        headers: { Authorization: localStorage.getItem("token") || "" }
      });
      if (response.ok) {
        const data = await response.json();
        setSubjects(data);
      }
    } catch {
      toast.error("Failed to fetch subjects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = editingId 
        ? `${import.meta.env.VITE_API_BASE_URL}/api/academic/subjects/${editingId}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/academic/subjects`;
      
      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token") || ""
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(`Subject ${editingId ? "updated" : "created"} successfully`);
        setFormData({ name: "", code: "", type: "Core", description: "", creditHours: 3, department: "" });
        setEditingId(null);
        fetchSubjects();
      }
    } catch {
      toast.error("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (sub: Subject) => {
    setEditingId(sub._id);
    setFormData({
      name: sub.name,
      code: sub.code,
      type: sub.type,
      description: sub.description || "",
      creditHours: sub.creditHours || 3,
      department: sub.department || ""
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/academic/subjects/${id}`, {
        method: "DELETE",
        headers: { Authorization: localStorage.getItem("token") || "" }
      });
      if (response.ok) {
        toast.success("Deleted");
        fetchSubjects();
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-transparent p-4 lg:p-8">
      <PageMeta
        title="Subjects Management | EduSphere"
        description="Organize school curriculum subjects"
      />
      <PageBreadcrumb pageTitle="Subjects Management" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Form Container */}
        <div className="lg:col-span-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900 h-fit text-left">
          <h3 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
            {editingId ? "Update Subject" : "Add New Subject"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Subject Name</label>
              <InputField
                placeholder="e.g. Mathematics"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Subject Code</label>
              <InputField
                placeholder="e.g. MATH101"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Credit Hours</label>
              <InputField
                type="number"
                value={formData.creditHours}
                onChange={(e) => setFormData({ ...formData, creditHours: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Department</label>
              <InputField
                placeholder="e.g. Science"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Subject Type</label>
              <select 
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as "Core" | "Elective" })}
              >
                <option value="Core">Core</option>
                <option value="Elective">Elective</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Brief Description</label>
              <textarea
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                placeholder="Details about syllabus..."
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {editingId ? "Update" : "Register Subject"}
              </Button>
              {editingId && (
                <Button variant="outline" onClick={() => {
                  setEditingId(null);
                  setFormData({ name: "", code: "", type: "Core", description: "", creditHours: 3, department: "" });
                }}>Cancel</Button>
              )}
            </div>
          </form>
        </div>

        {/* List Container */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white shadow-theme-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white text-left">Subject Registry</h3>
            <div className="relative max-w-xs w-full">
              <InputField
                placeholder="Quick search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-x-auto text-left">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-white/[0.02]">
                <tr>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Subject</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Code</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Type</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {loading ? (
                  <tr><td colSpan={4} className="py-10 text-center text-gray-500 text-left">Loading...</td></tr>
                ) : filteredSubjects.length === 0 ? (
                  <tr><td colSpan={4} className="py-10 text-center text-gray-500 text-left">No matches found</td></tr>
                ) : (
                  filteredSubjects.map((sub) => (
                    <tr key={sub._id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 dark:text-white">{sub.name}</span>
                          <span className="text-xs text-gray-500 truncate max-w-[200px]">{sub.description}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-left">{sub.code}</code>
                      </td>
                      <td className="px-6 py-4">
                        <Badge color={sub.type === "Core" ? "primary" : "info"}>
                          {sub.type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button onClick={() => handleEdit(sub)} className="text-brand-500 hover:text-brand-600 font-bold text-sm text-left">Edit</button>
                          <button onClick={() => handleDelete(sub._id)} className="text-error-500 hover:text-error-600 font-bold text-sm text-left">Delete</button>
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
    </div>
  );
}
