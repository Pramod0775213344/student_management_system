import { useState, useEffect } from "react";
import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import InputField from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import { toast } from "react-hot-toast";

interface AcademicYear {
  _id: string;
  name: string;
  status: "Active" | "Inactive";
}

interface Teacher {
  _id: string;
  firstName: string;
  lastName: string;
}

interface ClassGrade {
  _id: string;
  name: string;
  section: string;
  capacity: number;
  roomNumber?: string;
  academicYear: string;
  classTeacher?: Teacher | string;
}

export default function ClassesGrades() {
  const [classes, setClasses] = useState<ClassGrade[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedYearId, setSelectedYearId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    section: "",
    capacity: 40,
    roomNumber: "",
    academicYear: "",
    classTeacher: ""
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Initial Fetches
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const headers = { Authorization: localStorage.getItem("token") || "" };
        const [yearRes, teacherRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/academic/years`, { headers }),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/teachers`, { headers })
        ]);

        if (yearRes.ok) {
          const years = await yearRes.json();
          setAcademicYears(years);
          const activeYear = years.find((y: AcademicYear) => y.status === "Active");
          if (activeYear) {
            setSelectedYearId(activeYear._id);
            setFormData(prev => ({ ...prev, academicYear: activeYear._id }));
          } else if (years.length > 0) {
            setSelectedYearId(years[0]._id);
            setFormData(prev => ({ ...prev, academicYear: years[0]._id }));
          }
        }

        if (teacherRes.ok) {
          setTeachers(await teacherRes.json());
        }
      } catch {
        toast.error("Failed to load initial data");
      }
    };
    fetchInitialData();
  }, []);

  // Fetch classes when selectedYearId changes
  useEffect(() => {
    const fetchClasses = async () => {
      if (!selectedYearId) return;
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/academic/classes/${selectedYearId}`, {
          headers: { Authorization: localStorage.getItem("token") || "" }
        });
        if (response.ok) {
          const data = await response.json();
          setClasses(data);
        }
      } catch {
        toast.error("Failed to load classes");
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [selectedYearId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.academicYear) {
      toast.error("Select an Academic Year first");
      return;
    }

    setIsSubmitting(true);
    try {
      const url = editingId 
        ? `${import.meta.env.VITE_API_BASE_URL}/api/academic/classes/${editingId}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/academic/classes`;
      
      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token") || ""
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(`Class ${editingId ? "updated" : "created"} successfully`);
        setFormData({ name: "", section: "", capacity: 40, roomNumber: "", academicYear: selectedYearId, classTeacher: "" });
        setEditingId(null);
        // Refresh classes
        const refreshResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/academic/classes/${selectedYearId}`, {
          headers: { Authorization: localStorage.getItem("token") || "" }
        });
        if (refreshResponse.ok) setClasses(await refreshResponse.json());
      } else {
        toast.error("Failed to save class");
      }
    } catch {
      toast.error("Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (cls: ClassGrade) => {
    setEditingId(cls._id);
    const teacherId = typeof cls.classTeacher === "object" ? cls.classTeacher?._id : cls.classTeacher;
    setFormData({
      name: cls.name,
      section: cls.section,
      capacity: cls.capacity,
      roomNumber: cls.roomNumber || "",
      academicYear: selectedYearId,
      classTeacher: teacherId || ""
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this class? All students linked to it will lose their association.")) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/academic/classes/${id}`, {
        method: "DELETE",
        headers: { Authorization: localStorage.getItem("token") || "" }
      });
      if (response.ok) {
        toast.success("Deleted");
        setClasses(classes.filter(c => c._id !== id));
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-transparent p-4 lg:p-8">
      <PageMeta 
        title="Classes / Grades | EduSphere" 
        description="Manage school classes and grade sections"
      />
      <PageBreadCrumb pageTitle="Classes / Grades" />

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Classes & Sections</h2>
          <p className="text-sm text-gray-500">Manage classrooms and seat capacities</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Active Session:</span>
          <select 
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-brand-600 focus:ring-2 focus:ring-brand-500 dark:border-gray-800 dark:bg-gray-900"
            value={selectedYearId}
            onChange={(e) => {
              setSelectedYearId(e.target.value);
              setFormData(prev => ({ ...prev, academicYear: e.target.value }));
            }}
          >
            {academicYears.map(year => (
              <option key={year._id} value={year._id}>{year.name} {year.status === "Active" ? "(Current)" : ""}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900 h-fit">
          <h3 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
            {editingId ? "Modify Class" : "Define New Class"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Class/Grade Name</label>
              <InputField
                placeholder="e.g. Grade 10"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Section</label>
              <InputField
                placeholder="e.g. A"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Class Teacher</label>
              <Select
                options={teachers.map(t => ({ value: t._id, label: `${t.firstName} ${t.lastName}` }))}
                value={formData.classTeacher}
                onChange={(val) => setFormData({ ...formData, classTeacher: val })}
                placeholder="Assign a Teacher"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Capacity</label>
                <InputField
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Room No.</label>
                <InputField
                  placeholder="B-101"
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                />
              </div>
            </div>
            <div className="pt-2">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {editingId ? "Save Changes" : "Create Class"}
              </Button>
              {editingId && (
                <button 
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ ...formData, name: "", section: "", capacity: 40, roomNumber: "", classTeacher: "" });
                  }}
                  className="mt-2 w-full text-sm text-gray-500 hover:underline"
                >
                  Cancel editing
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white shadow-theme-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-white/[0.02]">
                <tr>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Class Name</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Section</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Class Teacher</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-400">Room</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-gray-500 italic">Syncing session data...</td>
                  </tr>
                ) : classes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-gray-500 italic">No classes defined for this academic session</td>
                  </tr>
                ) : (
                  classes.map((cls) => (
                    <tr key={cls._id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{cls.name}</td>
                      <td className="px-6 py-4">
                        <Badge color="primary" variant="light">{cls.section}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        {typeof cls.classTeacher === "object" ? (
                           <div className="flex items-center gap-2">
                             <div className="h-2 w-2 rounded-full bg-success-500"></div>
                             <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                               {cls.classTeacher.firstName} {cls.classTeacher.lastName}
                             </span>
                           </div>
                        ) : (
                           <span className="text-xs text-gray-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 font-medium">{cls.roomNumber || "N/A"}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-4">
                          <button onClick={() => handleEdit(cls)} className="text-brand-500 text-sm font-bold hover:underline">Edit</button>
                          <button onClick={() => handleDelete(cls._id)} className="text-error-500 text-sm font-bold hover:underline">Delete</button>
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

