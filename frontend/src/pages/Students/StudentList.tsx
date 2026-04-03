import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

// Student list eka pennana page eka system design ekata refactor kara
interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  classGrade?: { _id: string; name: string; section: string };
  academicYear?: { _id: string; name: string };
  dob: string;
  admissionDate: string;
  image?: string;
  status: string;
}

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const navigate = useNavigate();

  // Page eka load weddi student list eka fetch karagannawa
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/students`, {
        headers: { Authorization: localStorage.getItem("token") || "" },
      });
      if (!response.ok) throw new Error("Failed to fetch students");
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  // Search logic: Name, Email saha ID ekema check karanawa
  const filteredStudents = students.filter((student) => {
    const searchStr = searchTerm.toLowerCase();
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    const className = student.classGrade ? `${student.classGrade.name} ${student.classGrade.section}`.toLowerCase() : "";
    
    return (
      fullName.includes(searchStr) ||
      student.email.toLowerCase().includes(searchStr) ||
      student._id.toLowerCase().includes(searchStr) ||
      className.includes(searchStr)
    );
  });

  // Pagination logic: Filtered result eken select karagannawa
  const totalItems = filteredStudents.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  // Search term wenas weddi page 1 ekata yankara
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Student record ekak delete karana function eka
  const handleDelete = async (id: string) => {
    const isDark = document.documentElement.classList.contains("dark");
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this record!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#465fff",
      cancelButtonColor: "#f04438",
      confirmButtonText: "Yes, delete it!",
      background: isDark ? "#111827" : "#fff",
      color: isDark ? "#fff" : "#101828",
      customClass: {
        popup: "rounded-3xl border-none shadow-theme-xl",
        confirmButton: "rounded-xl px-6 py-3 font-bold",
        cancelButton: "rounded-xl px-6 py-3 font-bold"
      }
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/students/${id}`, {
          method: "DELETE",
          headers: { Authorization: localStorage.getItem("token") || "" },
        });
        if (response.ok) {
          setStudents((prev) => prev.filter((s: Student) => s._id !== id));
          toast.success("Student records removed successfully");
        } else {
          toast.error("Failed to delete record");
        }
      } catch (err) {
        console.error(err);
        toast.error("Record eka delete karanna bari una."); // Record deletion failed
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950/20 p-4 lg:p-8">
      <PageMeta
        title="Student Directory | EduSphere"
        description="Comprehensive official student management list"
      />
      <PageBreadcrumb pageTitle="Student List" />
      
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-theme-sm dark:border-white/5 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-between gap-6 p-6 lg:flex-row lg:p-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Student Enrollment List</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage all registered students and their academic profiles.</p>
          </div>
          
          <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-end lg:w-auto">
            {/* Search Input Area */}
            <div className="relative w-full sm:w-72">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-11 pr-4 text-sm shadow-theme-xs transition-all focus:border-brand-500 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              />
            </div>
            
            <Button 
              onClick={() => navigate("/students/add-student")}
              startIcon={
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                </svg>
              }
            >
              Add Student
            </Button>
          </div>
        </div>

        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <Table>
            <TableHeader className="border-y border-gray-100 bg-gray-50/50 dark:border-white/5 dark:bg-white/[0.02]">
              <TableRow>
                <TableCell isHeader className="px-6 py-4 text-start text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">ID</TableCell>
                <TableCell isHeader className="px-6 py-4 text-start text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Student Info</TableCell>
                <TableCell isHeader className="px-6 py-4 text-start text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Contact</TableCell>
                <TableCell isHeader className="px-6 py-4 text-start text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Grade</TableCell>
                <TableCell isHeader className="px-6 py-4 text-start text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Admission</TableCell>
                <TableCell isHeader className="px-6 py-4 text-start text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</TableCell>
                <TableCell isHeader className="px-6 py-4 text-end text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500 dark:border-gray-800"></div>
                      <span className="text-sm font-medium text-gray-500">Accessing secure database...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedStudents.length === 0 ? (
                <TableRow>
                   <TableCell colSpan={7} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800">
                        <svg className="h-8 w-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <p className="text-lg font-bold text-gray-500">
                        {searchTerm ? `No results found for "${searchTerm}"` : "No student records found"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedStudents.map((student) => (
                  <TableRow key={student._id} className="transition-colors hover:bg-gray-50/50 dark:hover:bg-white/[0.01]">
                    <TableCell className="px-6 py-4 text-sm font-medium text-gray-400">
                      #{student._id.substring(student._id.length - 4).toUpperCase()}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100 ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-white/10">
                          <img 
                            src={student.image || `https://ui-avatars.com/api/?name=${student.firstName}+${student.lastName}&background=465fff&color=fff&bold=true`} 
                            alt={student.firstName} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <span className="block text-sm font-bold text-gray-900 dark:text-white">{student.firstName} {student.lastName}</span>
                          <span className="block text-xs text-gray-500">{student.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{student.contactNumber || "N/A"}</TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge variant="light" color="primary" size="sm">
                        {student.classGrade ? `${student.classGrade.name} - ${student.classGrade.section}` : "Unassigned"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {student.admissionDate ? new Date(student.admissionDate).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge variant="light" color="success" size="sm">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/students/student-profile/${student._id}`)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-brand-500 dark:text-gray-400 dark:hover:bg-white/5"
                        >
                          <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => navigate(`/students/edit-student/${student._id}`)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-brand-500 dark:text-gray-400 dark:hover:bg-white/5"
                        >
                          <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(student._id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-error-500 dark:text-gray-400 dark:hover:bg-white/5"
                        >
                          <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls - Fully Functional */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 p-6 sm:flex-row dark:border-white/5 lg:p-8">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Showing <span className="text-gray-900 dark:text-white">{totalItems === 0 ? 0 : startIndex + 1}</span> to <span className="text-gray-900 dark:text-white">{Math.min(startIndex + itemsPerPage, totalItems)}</span> of <span className="text-gray-900 dark:text-white">{totalItems}</span> records
          </p>
          
          <div className="flex items-center gap-1.5">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:opacity-30 dark:border-white/5 dark:hover:bg-white/5"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
            </button>
            
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <button 
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`flex h-9 min-w-[36px] items-center justify-center rounded-lg px-2 text-sm font-bold transition-all ${
                    currentPage === pageNum 
                      ? "bg-brand-500 text-white shadow-brand-500/20" 
                      : "border border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-white/5 dark:hover:bg-white/5"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:opacity-30 dark:border-white/5 dark:hover:bg-white/5"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

