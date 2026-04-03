import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import InputField from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import DatePicker from "../../components/form/date-picker";
import Button from "../../components/ui/button/Button";

interface APIItem {
  _id: string;
  name?: string;
  section?: string;
  status?: string;
}

const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  contactNumber: "",
  dob: "",
  gender: "",
  academicYear: "",
  classGrade: "",
  address: "",
  admissionDate: new Date().toISOString().split("T")[0],
  guardianName: "",
  guardianContact: "",
  image: "",
};

export default function AddStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState(initialFormData);
  
  const [academicYears, setAcademicYears] = useState<APIItem[]>([]);
  const [classes, setClasses] = useState<APIItem[]>([]);

  const fetchStudent = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/students/${id}`, {
        headers: { Authorization: localStorage.getItem("token") || "" },
      });
      if (response.ok) {
        const data = await response.json();
        // Safe mapping with fallbacks to avoid null/undefined issues
        setFormData({
          ...initialFormData,
          ...data,
          dob: data.dob ? new Date(data.dob).toISOString().split("T")[0] : "",
          admissionDate: data.admissionDate ? new Date(data.admissionDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
          academicYear: data.academicYear?._id || data.academicYear || "",
          classGrade: data.classGrade?._id || data.classGrade || "",
          guardianName: data.guardianName || "",
          guardianContact: data.guardianContact || "",
          address: data.address || "",
          email: data.email || "",
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          gender: data.gender || "",
          contactNumber: data.contactNumber || "",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load student details");
    }
  }, [id]);

  const fetchInitialData = useCallback(async () => {
    try {
      const headers = { Authorization: localStorage.getItem("token") || "" };
      const yearsRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/academic/years`, { headers });
      if (yearsRes.ok) {
        const yearsData = await yearsRes.json();
        setAcademicYears(yearsData);
        if (!id) {
          const active = yearsData.find((y: APIItem) => y.status === "Active");
          if (active) setFormData(p => ({ ...p, academicYear: active._id }));
        }
      }
    } catch {
      toast.error("Failed to load academic sessions");
    }
  }, [id]);

  const fetchClasses = useCallback(async () => {
    if (!formData.academicYear) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/academic/classes/${formData.academicYear}`, {
        headers: { Authorization: localStorage.getItem("token") || "" }
      });
      if (res.ok) setClasses(await res.json());
    } catch {
      toast.error("Failed to load classes");
    }
  }, [formData.academicYear]);

  useEffect(() => {
    fetchInitialData();
    if (id) fetchStudent();
  }, [id, fetchInitialData, fetchStudent]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Please select a gender";
    if (!formData.academicYear) newErrors.academicYear = "Please select an academic year";
    if (!formData.classGrade) newErrors.classGrade = "Please select a class";
    if (!formData.guardianName.trim()) newErrors.guardianName = "Guardian name is required";
    if (!formData.guardianContact.trim()) newErrors.guardianContact = "Emergency contact is required";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleChange(e.target.name, e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    try {
      const url = id 
        ? `${import.meta.env.VITE_API_BASE_URL}/api/students/${id}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/students`;
      
      const method = id ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token") || "",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(id ? "Student updated successfully" : "Student registered successfully");
        setIsSubmitted(true);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <ComponentCard title="" desc="">
          <div className="text-center py-10 px-6">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-100 text-success-600">
              <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Registration Complete</h3>
            <p className="mb-8 text-gray-500 dark:text-gray-400">Student information has been successfully saved to the EduSphere database.</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button onClick={() => navigate("/students")}>View Student Directory</Button>
              <Button variant="outline" onClick={() => { setIsSubmitted(false); setFormData(initialFormData); }}>Register Another Student</Button>
            </div>
          </div>
        </ComponentCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent p-4 lg:p-8">
      <PageMeta title={`${id ? "Edit" : "Add"} Student | EduSphere`} description="Student registration form" />
      <PageBreadcrumb pageTitle={id ? "Edit Student Profile" : "New Student Registration"} />

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <ComponentCard title="Personal Information" desc="Full legal name and basic contact details">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="col-span-1">
                  <Label>First Name</Label>
                  <InputField
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter first name"
                    error={!!errors.firstName}
                    hint={errors.firstName}
                  />
                </div>
                <div className="col-span-1">
                  <Label>Last Name</Label>
                  <InputField
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter last name"
                    error={!!errors.lastName}
                    hint={errors.lastName}
                  />
                </div>
                <div className="col-span-1">
                  <Label>Date of Birth</Label>
                  <DatePicker
                    id="dob"
                    defaultDate={formData.dob}
                    onChange={(_, dateStr) => handleChange("dob", dateStr)}
                    placeholder="Select Date"
                  />
                  {errors.dob && <p className="mt-1 text-xs text-error-500">{errors.dob}</p>}
                </div>
                <div className="col-span-1">
                  <Label>Gender</Label>
                  <Select
                    options={[
                      { value: "Male", label: "Male" },
                      { value: "Female", label: "Female" },
                      { value: "Other", label: "Other" },
                    ]}
                    value={formData.gender}
                    onChange={(val) => handleChange("gender", val)}
                    placeholder="Select Gender"
                    error={!!errors.gender}
                    hint={errors.gender}
                  />
                </div>
              </div>
            </ComponentCard>

            <ComponentCard title="Academic Placement" desc="Session, class and admission info">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="col-span-1">
                  <Label>Academic Session</Label>
                  <Select
                    options={academicYears.map(y => ({ value: y._id, label: y.name || "" }))}
                    value={formData.academicYear}
                    onChange={(val) => handleChange("academicYear", val)}
                    placeholder="Select Session"
                    error={!!errors.academicYear}
                    hint={errors.academicYear}
                  />
                </div>
                <div className="col-span-1">
                  <Label>Class / Grade</Label>
                  <Select
                    options={classes.map(c => ({ value: c._id, label: `${c.name} - ${c.section}` }))}
                    value={formData.classGrade}
                    onChange={(val) => handleChange("classGrade", val)}
                    placeholder="Select Class"
                    error={!!errors.classGrade}
                    hint={errors.classGrade}
                  />
                </div>
                <div className="col-span-full">
                  <Label>Date of Admission</Label>
                  <DatePicker
                    id="admissionDate"
                    defaultDate={formData.admissionDate}
                    onChange={(_, dateStr) => handleChange("admissionDate", dateStr)}
                    placeholder="Select Admission Date"
                  />
                </div>
              </div>
            </ComponentCard>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <ComponentCard title="Guardian Details" desc="Emergency contact information">
              <div className="space-y-6">
                <div>
                  <Label>Guardian Name</Label>
                  <InputField
                    type="text"
                    name="guardianName"
                    value={formData.guardianName}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    error={!!errors.guardianName}
                    hint={errors.guardianName}
                  />
                </div>
                <div>
                  <Label>Contact Number</Label>
                  <InputField
                    type="text"
                    name="guardianContact"
                    value={formData.guardianContact}
                    onChange={handleInputChange}
                    placeholder="Enter contact number"
                    error={!!errors.guardianContact}
                    hint={errors.guardianContact}
                  />
                </div>
              </div>
            </ComponentCard>

            <ComponentCard title="Action Center" desc="Finalize the registration">
              <div className="space-y-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Processing..." : id ? "Update Data" : "Register Student"}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => navigate("/students")}
                  type="button"
                >
                  Cancel
                </Button>
              </div>
            </ComponentCard>
          </div>
        </div>
      </form>
    </div>
  );
}
