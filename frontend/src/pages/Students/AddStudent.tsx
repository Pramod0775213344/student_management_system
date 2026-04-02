import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import DatePicker from "../../components/form/date-picker";
import Select from "../../components/form/Select";

export default function AddStudent() {
  return (
    <div>
      <PageMeta title="Add Student | EduSphere" description="Add Student page for EduSphere" />
      <PageBreadcrumb pageTitle="Add Student" />
      
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
          Student Registration Form
        </h3>
        
        <form className="space-y-8">
          {/* --- 1. Personal Information --- */}
          <div>
            <h4 className="mb-4 text-theme-md font-medium text-gray-800 dark:text-white/90">
              1. Personal Information
            </h4>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input type="text" id="fullName" placeholder="Enter full name" />
              </div>
              
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <DatePicker id="dateOfBirth" placeholder="Select Date of Birth" />
              </div>

              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select
                  options={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                    { value: "other", label: "Other" },
                  ]}
                  placeholder="Select Gender"
                  onChange={(val) => console.log(val)}
                />
              </div>

              <div>
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input type="text" id="contactNumber" placeholder="Enter contact number" />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input type="text" id="address" placeholder="Enter residence address" />
              </div>
            </div>
          </div>

          {/* --- 2. Academic Information --- */}
          <div>
            <h4 className="mb-4 mt-6 text-theme-md font-medium text-gray-800 dark:text-white/90">
              2. Academic Information
            </h4>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="gradeClass">Grade / Class</Label>
                <Select
                  options={[
                    { value: "grade-1", label: "Grade 1" },
                    { value: "grade-2", label: "Grade 2" },
                    { value: "grade-3", label: "Grade 3" },
                    { value: "grade-4", label: "Grade 4" },
                    { value: "grade-5", label: "Grade 5" },
                  ]}
                  placeholder="Select Class"
                  onChange={(val) => console.log(val)}
                />
              </div>

              <div>
                <Label htmlFor="admissionNumber">Admission Number</Label>
                <Input type="text" id="admissionNumber" placeholder="e.g. ADM-2024-001" />
              </div>

              <div>
                <Label htmlFor="admissionDate">Admission Date</Label>
                <DatePicker id="admissionDate" placeholder="Select Admission Date" />
              </div>

              <div>
                <Label htmlFor="academicYear">Academic Year</Label>
                <Select
                  options={[
                    { value: "2023-2024", label: "2023-2024" },
                    { value: "2024-2025", label: "2024-2025" },
                    { value: "2025-2026", label: "2025-2026" },
                  ]}
                  placeholder="Select Academic Year"
                  onChange={(val) => console.log(val)}
                />
              </div>
            </div>
          </div>

          {/* --- 3. Guardian / Parent Information --- */}
          <div>
            <h4 className="mb-4 mt-6 text-theme-md font-medium text-gray-800 dark:text-white/90">
              3. Guardian / Parent Information
            </h4>
            
            {/* Primary Parent */}
            <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-white/[0.02]">
              <h5 className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                Primary Guardian / Parent
              </h5>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <Label htmlFor="primaryParentName">Name</Label>
                  <Input type="text" id="primaryParentName" placeholder="Enter name" />
                </div>

                <div>
                  <Label htmlFor="primaryRelationship">Relationship</Label>
                  <Select
                    options={[
                      { value: "father", label: "Father" },
                      { value: "mother", label: "Mother" },
                      { value: "guardian", label: "Guardian" },
                    ]}
                    placeholder="Select Relationship"
                    onChange={(val) => console.log(val)}
                  />
                </div>

                <div>
                  <Label htmlFor="primaryParentContact">Contact Number</Label>
                  <Input type="text" id="primaryParentContact" placeholder="Enter contact number" />
                </div>

                <div>
                  <Label htmlFor="primaryParentEmail">Email Address (Optional)</Label>
                  <Input type="email" id="primaryParentEmail" placeholder="Enter valid email address" />
                </div>
              </div>
            </div>

            {/* Secondary Parent */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-white/[0.02]">
              <h5 className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                Secondary Guardian / Parent (Optional)
              </h5>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <Label htmlFor="secondaryParentName">Name</Label>
                  <Input type="text" id="secondaryParentName" placeholder="Enter name" />
                </div>

                <div>
                  <Label htmlFor="secondaryRelationship">Relationship</Label>
                  <Select
                    options={[
                      { value: "father", label: "Father" },
                      { value: "mother", label: "Mother" },
                      { value: "guardian", label: "Guardian" },
                    ]}
                    placeholder="Select Relationship"
                    onChange={(val) => console.log(val)}
                  />
                </div>

                <div>
                  <Label htmlFor="secondaryParentContact">Contact Number</Label>
                  <Input type="text" id="secondaryParentContact" placeholder="Enter contact number" />
                </div>

                <div>
                  <Label htmlFor="secondaryParentEmail">Email Address (Optional)</Label>
                  <Input type="email" id="secondaryParentEmail" placeholder="Enter valid email address" />
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 mt-8">
            <button
              type="button"
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 focus:ring-4 focus:ring-brand-500/20 transition-colors"
            >
              Save Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
