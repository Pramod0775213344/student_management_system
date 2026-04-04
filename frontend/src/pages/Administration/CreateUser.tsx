import React, { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { toast } from "react-hot-toast";

interface UnaccountedUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function CreateUser() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student",
    linkedId: "", 
  });
  const [loading, setLoading] = useState(false);
  const [unaccountedUsers, setUnaccountedUsers] = useState<UnaccountedUser[]>([]);
  const [fetchingUsers, setFetchingUsers] = useState(false);

  // Fetch users without accounts based on selected role
  useEffect(() => {
    const fetchUnaccounted = async () => {
      if (formData.role === "admin") {
        setUnaccountedUsers([]);
        return;
      }

      setFetchingUsers(true);
      try {
        const endpoint = formData.role === "student" ? "unaccounted-students" : "unaccounted-teachers";
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/${endpoint}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });
        
        if (!response.ok) throw new Error("Failed to fetch users");
        
        const data = await response.json();
        setUnaccountedUsers(data);
      } catch (err) {
        console.error(err);
        toast.error("Could not load available " + formData.role + "s");
      } finally {
        setFetchingUsers(false);
      }
    };

    fetchUnaccounted();
  }, [formData.role]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // If selecting a user from the dropdown, auto-fill email if available
    if (name === "linkedId" && value !== "") {
      const selectedUser = unaccountedUsers.find(u => u._id === value);
      if (selectedUser && selectedUser.email) {
        setFormData(prev => ({ ...prev, linkedId: value, email: selectedUser.email }));
        return;
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset linkedId if role changes to admin
      ...(name === "role" && value === "admin" ? { linkedId: "" } : {}),
      // Clear linkedId if role changes (so they have to pick a new one)
      ...(name === "role" && value !== prev.role ? { linkedId: "" } : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.role !== "admin" && !formData.linkedId) {
      toast.error(`Please select a ${formData.role} to link.`);
      return;
    }

    setLoading(true);

    const createPromise = fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/create-account`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData),
    }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create account");
      }
      
      // Refresh the list after successful creation
      setUnaccountedUsers(prev => prev.filter(u => u._id !== formData.linkedId));
      
      setFormData({
        email: "",
        password: "",
        role: "student",
        linkedId: "",
      });
      return data;
    });

    toast.promise(createPromise, {
      loading: "Creating user account...",
      success: "User account created successfully!",
      error: (err) => err.message,
    });

    try {
      await createPromise;
    } catch {
      // Error is handled by toast.promise
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageMeta title="Create User | EduSphere" description="Create new user accounts" />
      <PageBreadcrumb pageTitle="User Management" />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="p-5 border-b border-gray-200 dark:border-gray-800 sm:p-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Register New User
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Create a new account for a Student, Teacher, or Admin.
            </p>
          </div>
        </div>
        
        <div className="p-5 sm:p-6">
          <form onSubmit={handleSubmit} className="mx-auto w-full max-w-[600px] space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              
              <div>
                <Label>User Role <span className="text-error-500">*</span></Label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full text-sm text-gray-800 dark:text-white/90 rounded-lg border border-gray-300 px-4 py-[9px] dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {formData.role !== "admin" && (
                <div>
                  <Label>
                    Select {formData.role === "student" ? "Student" : "Teacher"} <span className="text-error-500">*</span>
                  </Label>
                  <select
                    name="linkedId"
                    value={formData.linkedId}
                    onChange={handleChange}
                    required
                    disabled={fetchingUsers}
                    className="w-full text-sm text-gray-800 dark:text-white/90 rounded-lg border border-gray-300 px-4 py-[9px] dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                  >
                    <option value="">{fetchingUsers ? "Loading..." : `Choose a ${formData.role}...`}</option>
                    {unaccountedUsers.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.firstName} {user.lastName} ({user.email || "No email"})
                      </option>
                    ))}
                  </select>
                  {unaccountedUsers.length === 0 && !fetchingUsers && formData.role !== "admin" && (
                    <p className="mt-2 text-xs text-warning-500">
                      All {formData.role}s already have an account or none were found.
                    </p>
                  )}
                </div>
              )}

              <div className="col-span-1 sm:col-span-2">
                <Label>Email Address <span className="text-error-500">*</span></Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="email@example.com"
                  hint={formData.role !== 'admin' ? "Usually matches the person's record" : ""}
                />
              </div>

              <div className="col-span-1 sm:col-span-2">
                <Label>Temporary Password <span className="text-error-500">*</span></Label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Min 8 characters"
                />
              </div>

            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" className="w-full sm:w-auto px-10" disabled={loading || fetchingUsers}>
                {loading ? "Processing..." : "Create Account"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
