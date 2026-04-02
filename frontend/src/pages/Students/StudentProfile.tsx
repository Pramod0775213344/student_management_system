import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";

const student = {
  id: "STD-001",
  name: "Kamal Perera",
  image: "/images/user/user-17.jpg",
  grade: "Grade 10 - A",
  admissionNumber: "ADM-2023-001",
  admissionDate: "2023-01-15",
  academicYear: "2024-2025",
  dateOfBirth: "2009-06-12",
  gender: "Male",
  address: "No. 45, Galle Road, Colombo 3",
  contactNumber: "+94 77 123 4567",
  status: "Active" as const,
  attendance: 87,
  totalDays: 120,
  presentDays: 104,
  absentDays: 16,
  parents: [
    {
      name: "Nimal Perera",
      relationship: "Father",
      contact: "+94 77 987 6543",
      email: "nimal.perera@gmail.com",
    },
    {
      name: "Kamala Perera",
      relationship: "Mother",
      contact: "+94 71 234 5678",
      email: "kamala.perera@gmail.com",
    },
  ],
  subjects: [
    { name: "Mathematics", grade: "A", marks: 92 },
    { name: "Science", grade: "A", marks: 88 },
    { name: "English", grade: "B+", marks: 78 },
    { name: "Sinhala", grade: "A+", marks: 96 },
    { name: "History", grade: "B", marks: 72 },
    { name: "Geography", grade: "A", marks: 85 },
  ],
};

type Tab = "overview" | "academic" | "parents";

export default function StudentProfile() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "academic", label: "Academic" },
    { key: "parents", label: "Parents / Guardians" },
  ];

  return (
    <div>
      <PageMeta
        title={`${student.name} | Student Profile | EduSphere`}
        description="Student Profile detail page for EduSphere"
      />
      <PageBreadcrumb pageTitle="Student Profile" />

      {/* Top Profile Card */}
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          {/* Avatar */}
          <div className="relative">
            <div className="h-24 w-24 overflow-hidden rounded-2xl border-4 border-brand-100 dark:border-brand-900/40">
              <img
                src={student.image}
                alt={student.name}
                width={96}
                height={96}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-success-500 dark:border-gray-900"></span>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{student.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {student.grade} &nbsp;•&nbsp; {student.admissionNumber}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <Badge size="sm" color={student.status === "Active" ? "success" : "error"}>
                  {student.status}
                </Badge>
                <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl bg-gray-50 px-4 py-3 text-center dark:bg-white/[0.04]">
                <p className="text-xl font-bold text-gray-800 dark:text-white">{student.attendance}%</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Attendance</p>
              </div>
              <div className="rounded-xl bg-gray-50 px-4 py-3 text-center dark:bg-white/[0.04]">
                <p className="text-xl font-bold text-gray-800 dark:text-white">{student.presentDays}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Days Present</p>
              </div>
              <div className="rounded-xl bg-gray-50 px-4 py-3 text-center dark:bg-white/[0.04]">
                <p className="text-xl font-bold text-error-500">{student.absentDays}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Days Absent</p>
              </div>
              <div className="rounded-xl bg-gray-50 px-4 py-3 text-center dark:bg-white/[0.04]">
                <p className="text-xl font-bold text-gray-800 dark:text-white">{student.subjects.length}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Subjects</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 flex gap-1 rounded-xl border border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-white/[0.03]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-brand-500 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- Tab: Overview --- */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Personal Info */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h4 className="mb-4 text-base font-semibold text-gray-800 dark:text-white">Personal Information</h4>
            <div className="space-y-4">
              {[
                { label: "Full Name", value: student.name },
                { label: "Date of Birth", value: student.dateOfBirth },
                { label: "Gender", value: student.gender },
                { label: "Contact Number", value: student.contactNumber },
                { label: "Address", value: student.address },
              ].map((item) => (
                <div key={item.label} className="flex items-start justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{item.label}</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white text-right max-w-[60%]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Info */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h4 className="mb-4 text-base font-semibold text-gray-800 dark:text-white">Academic Information</h4>
            <div className="space-y-4">
              {[
                { label: "Grade / Class", value: student.grade },
                { label: "Admission Number", value: student.admissionNumber },
                { label: "Admission Date", value: student.admissionDate },
                { label: "Academic Year", value: student.academicYear },
              ].map((item) => (
                <div key={item.label} className="flex items-start justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{item.label}</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- Tab: Academic --- */}
      {activeTab === "academic" && (
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <h4 className="text-base font-semibold text-gray-800 dark:text-white">Subject Results</h4>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {student.subjects.map((subject) => (
              <div key={subject.name} className="flex items-center justify-between px-6 py-4">
                <span className="text-sm font-medium text-gray-800 dark:text-white">{subject.name}</span>
                <div className="flex items-center gap-4">
                  {/* Progress Bar */}
                  <div className="hidden w-36 sm:block">
                    <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className={`h-2 rounded-full ${
                          subject.marks >= 90 ? "bg-success-500" :
                          subject.marks >= 75 ? "bg-brand-500" :
                          subject.marks >= 60 ? "bg-warning-500" : "bg-error-500"
                        }`}
                        style={{ width: `${subject.marks}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="w-12 text-right text-sm text-gray-500 dark:text-gray-400">{subject.marks}%</span>
                  <Badge
                    size="sm"
                    color={
                      subject.marks >= 90 ? "success" :
                      subject.marks >= 75 ? "info" :
                      subject.marks >= 60 ? "warning" : "error"
                    }
                  >
                    {subject.grade}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- Tab: Parents --- */}
      {activeTab === "parents" && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {student.parents.map((parent, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-500 dark:bg-brand-900/30 dark:text-brand-400">
                  <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                </div>
                <div>
                  <h5 className="text-base font-semibold text-gray-800 dark:text-white">{parent.name}</h5>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{parent.relationship}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <svg className="h-4 w-4 text-gray-400 fill-current flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">{parent.contact}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <svg className="h-4 w-4 text-gray-400 fill-current flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">{parent.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
