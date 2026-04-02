import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

interface Student {
  id: string;
  name: string;
  image: string;
  grade: string;
  parentContact: string;
  admissionDate: string;
  status: "Active" | "Inactive" | "Suspended";
}

const studentData: Student[] = [
  {
    id: "STD-001",
    name: "Kamal Perera",
    image: "/images/user/user-17.jpg",
    grade: "Grade 10",
    parentContact: "+94 77 123 4567",
    admissionDate: "2023-01-15",
    status: "Active",
  },
  {
    id: "STD-002",
    name: "Nimali Silva",
    image: "/images/user/user-18.jpg",
    grade: "Grade 11",
    parentContact: "+94 71 234 5678",
    admissionDate: "2022-05-10",
    status: "Active",
  },
  {
    id: "STD-003",
    name: "Sadun Kumara",
    image: "/images/user/user-19.jpg",
    grade: "Grade 9",
    parentContact: "+94 76 345 6789",
    admissionDate: "2024-02-20",
    status: "Inactive",
  },
  {
    id: "STD-004",
    name: "Tharushi Fernando",
    image: "/images/user/user-20.jpg",
    grade: "Grade 12",
    parentContact: "+94 70 456 7890",
    admissionDate: "2021-01-10",
    status: "Active",
  },
  {
    id: "STD-005",
    name: "Kasun Jayasuriya",
    image: "/images/user/user-21.jpg",
    grade: "Grade 8",
    parentContact: "+94 75 567 8901",
    admissionDate: "2024-05-22",
    status: "Suspended",
  },
];

export default function StudentList() {
  return (
    <div>
      <PageMeta
        title="Student List | EduSphere"
        description="View and manage all students in EduSphere"
      />
      <PageBreadcrumb pageTitle="Student List" />

      {/* Top Controls: Search and Filters */}
      <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="w-full sm:w-1/3">
          <input
            type="text"
            placeholder="Search by name, ID or phone..."
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-brand-500"
          />
        </div>
        <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
          <select className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white">
            <option value="">All Grades</option>
            <option value="9">Grade 9</option>
            <option value="10">Grade 10</option>
            <option value="11">Grade 11</option>
            <option value="12">Grade 12</option>
          </select>
          <button className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600">
            <svg
              className="fill-current"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M15 7H9V1C9 0.4 8.6 0 8 0C7.4 0 7 0.4 7 1V7H1C0.4 7 0 7.4 0 8C0 8.6 0.4 9 1 9H7V15C7 15.6 7.4 16 8 16C8.6 16 9 15.6 9 15V9H15C15.6 9 16 8.6 16 8C16 7.4 15.6 7 15 7Z" />
            </svg>
            Add Student
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Student Name
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Student ID
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Class / Grade
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Guardian Contact
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Admission Date
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Status
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {studentData.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                        <img width={40} height={40} src={student.image} alt={student.name} />
                      </div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {student.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {student.id}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {student.grade}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {student.parentContact}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {student.admissionDate}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <Badge
                      size="sm"
                      color={
                        student.status === "Active"
                          ? "success"
                          : student.status === "Inactive"
                          ? "warning"
                          : "error"
                      }
                    >
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <div className="flex items-center gap-3">
                      <button className="text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-500">
                        <svg className="fill-current w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                        </svg>
                      </button>
                      <button className="text-gray-500 hover:text-orange-500 dark:text-gray-400 dark:hover:text-orange-500">
                        <svg className="fill-current w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                      </button>
                      <button className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500">
                        <svg className="fill-current w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
