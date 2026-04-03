import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import InputField from "../../components/form/input/InputField";
import { toast } from "react-hot-toast";

interface AcademicYear {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Inactive";
}

export default function AcademicYearSetup() {
  const [years, setYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    startDate: string;
    endDate: string;
    status: "Active" | "Inactive";
  }>({
    name: "",
    startDate: "",
    endDate: "",
    status: "Inactive"
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchYears = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/academic/years`, {
        headers: { Authorization: localStorage.getItem("token") || "" }
      });
      if (response.ok) {
        const data = await response.json();
        setYears(data);
      }
    } catch {
      toast.error("Failed to fetch academic years");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYears();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = editingId 
        ? `${import.meta.env.VITE_API_BASE_URL}/api/academic/years/${editingId}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/academic/years`;
      
      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token") || ""
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(`Academic year ${editingId ? "updated" : "created"} successfully`);
        setFormData({ name: "", startDate: "", endDate: "", status: "Inactive" });
        setEditingId(null);
        fetchYears();
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || "An error occurred. Please check your inputs.");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (year: AcademicYear) => {
    setEditingId(year._id);
    setFormData({
      name: year.name,
      startDate: year.startDate.split("T")[0],
      endDate: year.endDate.split("T")[0],
      status: year.status
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this academic year?")) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/academic/years/${id}`, {
        method: "DELETE",
        headers: { Authorization: localStorage.getItem("token") || "" }
      });
      if (response.ok) {
        toast.success("Deleted successfully");
        fetchYears();
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-transparent p-4 lg:p-8">
      <PageMeta
        title="Academic Year Setup | EduSphere"
        description="Configure school academic sessions"
      />
      <PageBreadcrumb pageTitle="Academic Year Setup" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Form Container */}
        <div className="lg:col-span-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
            {editingId ? "Edit Session" : "New Academic Session"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Session Name</label>
              <InputField
                placeholder="e.g. 2024/2025"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Start Date</label>
              <InputField
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">End Date</label>
              <InputField
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Default Status</label>
              <select 
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as "Active" | "Inactive" })}
              >
                <option value="Inactive">Inactive</option>
                <option value="Active">Active</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {editingId ? "Update Session" : "Create Session"}
              </Button>
              {editingId && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ name: "", startDate: "", endDate: "", status: "Inactive" });
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* List Container */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white shadow-theme-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Session History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-white/[0.02]">
                <tr>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Session</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Timeline</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Status</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-gray-500">Loading sessions...</td>
                  </tr>
                ) : years.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-gray-500">No academic years configured</td>
                  </tr>
                ) : (
                  years.map((year) => (
                    <tr key={year._id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900 dark:text-white">{year.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(year.startDate).toLocaleDateString()} - {new Date(year.endDate).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge color={year.status === "Active" ? "success" : "warning"}>
                          {year.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleEdit(year)}
                            className="text-brand-500 hover:text-brand-600 font-bold text-sm"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(year._id)}
                            className="text-error-500 hover:text-error-600 font-bold text-sm"
                          >
                            Delete
                          </button>
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
