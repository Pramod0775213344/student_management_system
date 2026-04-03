import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import InputField from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import DatePicker from "../../components/form/date-picker";
import TextArea from "../../components/form/input/TextArea";
import Button from "../../components/ui/button/Button";
import { useCallback } from "react";

const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  contactNumber: "",
  dob: "",
  gender: "",
  address: "",
  department: "",
  qualification: "",
  joiningDate: new Date().toISOString().split("T")[0],
};

export default function AddTeacher() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState(initialFormData);

  const fetchTeacher = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/teachers/${id}`, {
        headers: { Authorization: localStorage.getItem("token") || "" },
      });
      if (response.ok) {
        const data = await response.json();
        setFormData({
          ...data,
          dob: data.dob ? new Date(data.dob).toISOString().split("T")[0] : "",
          joiningDate: data.joiningDate ? new Date(data.joiningDate).toISOString().split("T")[0] : "",
        });
      }
    } catch {
      toast.error("Failed to load teacher details");
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchTeacher();
    }
  }, [id, fetchTeacher]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.department) newErrors.department = "Department is required";
    
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
    const { name, value } = e.target;
    handleChange(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill required fields");
      return;
    }

    setLoading(true);
    const method = id ? "PUT" : "POST";
    const url = id 
      ? `${import.meta.env.VITE_API_BASE_URL}/api/teachers/${id}`
      : `${import.meta.env.VITE_API_BASE_URL}/api/teachers`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token") || "",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast.success(id ? "Teacher Record Updated" : "Teacher Registered Successfully");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Operation failed");
      }
    } catch {
      toast.error("A network error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-6">
        <div className="w-full max-w-2xl scale-in-center rounded-3xl bg-white p-12 text-center shadow-theme-sm dark:bg-gray-900">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-success-50 text-success-500 dark:bg-success-500/10">
            <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mb-4 text-4xl font-black text-gray-900 dark:text-white">Done!</h2>
          <p className="mb-10 text-lg font-medium text-gray-500 dark:text-gray-400">
            The faculty record for <span className="font-bold text-gray-900 dark:text-white">{formData.firstName} {formData.lastName}</span> has been processed.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button onClick={() => navigate("/staff/teacher-list")}>View Faculty List</Button>
            <Button variant="outline" onClick={() => { setIsSubmitted(false); setFormData(initialFormData); }}>Register Another</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent p-4 lg:p-8">
      <PageMeta title={id ? "Edit Teacher | EduSphere" : "Add Teacher | EduSphere"} description="Onboard new faculty staff" />
      <PageBreadcrumb pageTitle={id ? "Edit Teacher" : "Teacher Onboarding"} items={[{ label: "Staff List", path: "/staff/teacher-list" }]} />

      <form onSubmit={handleSubmit} className="mt-8 space-y-7">
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
          {/* Section 1: Identity */}
          <ComponentCard title="Identity Details" desc="Basic personal information">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="col-span-1">
                <Label>First Name</Label>
                <InputField name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First name" error={!!errors.firstName} hint={errors.firstName} />
              </div>
              <div className="col-span-1">
                <Label>Last Name</Label>
                <InputField name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last name" error={!!errors.lastName} hint={errors.lastName} />
              </div>
              <div className="col-span-1">
                <Label>Date of Birth</Label>
                <DatePicker id="dob" defaultDate={formData.dob} onChange={(_, dateStr) => handleChange("dob", dateStr)} />
              </div>
              <div className="col-span-1">
                <Label>Gender</Label>
                <Select options={[{ value: "Male", label: "Male" }, { value: "Female", label: "Female" }]} value={formData.gender} onChange={(val) => handleChange("gender", val)} placeholder="Select Gender" />
              </div>
            </div>
          </ComponentCard>

          {/* Section 2: Professional */}
          <ComponentCard title="Professional Info" desc="Academic and workplace details">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="col-span-1">
                <Label>Department</Label>
                <Select options={[{ value: "Science", label: "Science" }, { value: "Math", label: "Mathematics" }, { value: "Arts", label: "Arts" }, { value: "Commerce", label: "Commerce" }]} value={formData.department} onChange={(val) => handleChange("department", val)} placeholder="Select Dept." error={!!errors.department} hint={errors.department} />
              </div>
              <div className="col-span-1">
                <Label>Qualification</Label>
                <InputField name="qualification" value={formData.qualification} onChange={handleInputChange} placeholder="e.g. M.Sc, PhD" />
              </div>
              <div className="col-span-full">
                <Label>Joining Date</Label>
                <DatePicker id="joiningDate" defaultDate={formData.joiningDate} onChange={(_, dateStr) => handleChange("joiningDate", dateStr)} />
              </div>
            </div>
          </ComponentCard>

          {/* Section 3: Contact */}
          <ComponentCard title="Contact & Address" desc="Where to reach the teacher">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="col-span-1">
                <Label>Email</Label>
                <InputField type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="official@school.com" error={!!errors.email} hint={errors.email} />
              </div>
              <div className="col-span-1">
                <Label>Phone</Label>
                <InputField name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} placeholder="+94..." />
              </div>
              <div className="col-span-full">
                <Label>Residential Address</Label>
                <TextArea value={formData.address} onChange={(val) => handleChange("address", val)} placeholder="Current address" rows={2} />
              </div>
            </div>
          </ComponentCard>
        </div>

        <div className="flex items-center justify-end gap-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-theme-sm dark:border-white/5 dark:bg-gray-900">
          <Button variant="outline" onClick={() => navigate("/staff/teacher-list")} disabled={loading}>Cancel</Button>
          <Button type="submit" disabled={loading}>{loading ? "Saving..." : (id ? "Update Teacher" : "Register Teacher")}</Button>
        </div>
      </form>
    </div>
  );
}
