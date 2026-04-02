const fs = require('fs');
const path = require('path');

// 1. REPAIR APP.TSX
const appPath = path.join('frontend', 'src', 'App.tsx');
let appContent = `import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { ReactNode } from "react";

// --- NEW IMPORTS
import AddStudent from './pages/Students/AddStudent';
import StudentList from './pages/Students/StudentList';
import StudentProfile from './pages/Students/StudentProfile';
import EnrollmentAdmission from './pages/Students/EnrollmentAdmission';
import BulkImport from './pages/Students/BulkImport';
import AddTeacher from './pages/Staff/AddTeacher';
import TeacherList from './pages/Staff/TeacherList';
import AssignSubjects from './pages/Staff/AssignSubjects';
import StaffAttendance from './pages/Staff/StaffAttendance';
import ClassesGrades from './pages/Academic/ClassesGrades';
import Subjects from './pages/Academic/Subjects';
import Curriculum from './pages/Academic/Curriculum';
import AcademicYearSetup from './pages/Academic/AcademicYearSetup';
import StudentAttendance from './pages/Attendance/StudentAttendance';
import TeacherAttendance from './pages/Attendance/TeacherAttendance';
import AttendanceReports from './pages/Attendance/AttendanceReports';
import FeeStructure from './pages/Fees/FeeStructure';
import GenerateInvoices from './pages/Fees/GenerateInvoices';
import Payments from './pages/Fees/Payments';
import PendingFees from './pages/Fees/PendingFees';
import Receipts from './pages/Fees/Receipts';
import ExamSchedule from './pages/Exams/ExamSchedule';
import MarksEntry from './pages/Exams/MarksEntry';
import Results from './pages/Exams/Results';
import ReportCards from './pages/Exams/ReportCards';
import ClassTimetable from './pages/Timetable/ClassTimetable';
import TeacherTimetable from './pages/Timetable/TeacherTimetable';
import RoomAllocation from './pages/Timetable/RoomAllocation';
import Notices from './pages/Communication/Notices';
import EmailSMSSend from './pages/Communication/EmailSMSSend';
import ParentMessages from './pages/Communication/ParentMessages';
import ParentList from './pages/Parents/ParentList';
import LinkStudent from './pages/Parents/LinkStudent';
import ParentPortalAccess from './pages/Parents/ParentPortalAccess';
import UploadDocuments from './pages/Documents/UploadDocuments';
import Certificates from './pages/Documents/Certificates';
import DownloadCenter from './pages/Documents/DownloadCenter';
import ReportsAttendanceReports from './pages/Reports/ReportsAttendanceReports';
import AcademicReports from './pages/Reports/AcademicReports';
import FinancialReports from './pages/Reports/FinancialReports';
import ExportPDFExcel from './pages/Reports/ExportPDFExcel';
import Users from './pages/Administration/Users';
import RolesPermissions from './pages/Administration/RolesPermissions';
import SystemSettings from './pages/Administration/SystemSettings';
import BranchSchoolSetup from './pages/Administration/BranchSchoolSetup';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/signin" />;
  }
  return children;
};

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index path="/dashboard" element={<Home />} />

            {/* --- NEW ROUTES --- */}
            <Route path="/students/add-student" element={<AddStudent />} />
            <Route path="/students/student-list" element={<StudentList />} />
            <Route path="/students/student-profile" element={<StudentProfile />} />
            <Route path="/students/enrollment-admission" element={<EnrollmentAdmission />} />
            <Route path="/students/bulk-import" element={<BulkImport />} />
            <Route path="/staff/add-teacher" element={<AddTeacher />} />
            <Route path="/staff/teacher-list" element={<TeacherList />} />
            <Route path="/staff/assign-subjects" element={<AssignSubjects />} />
            <Route path="/staff/staff-attendance" element={<StaffAttendance />} />
            <Route path="/academic/classes-grades" element={<ClassesGrades />} />
            <Route path="/academic/subjects" element={<Subjects />} />
            <Route path="/academic/curriculum" element={<Curriculum />} />
            <Route path="/academic/academic-year-setup" element={<AcademicYearSetup />} />
            <Route path="/attendance/student-attendance" element={<StudentAttendance />} />
            <Route path="/attendance/teacher-attendance" element={<TeacherAttendance />} />
            <Route path="/attendance/attendance-reports" element={<AttendanceReports />} />
            <Route path="/fees/fee-structure" element={<FeeStructure />} />
            <Route path="/fees/generate-invoices" element={<GenerateInvoices />} />
            <Route path="/fees/payments" element={<Payments />} />
            <Route path="/fees/pending-fees" element={<PendingFees />} />
            <Route path="/fees/receipts" element={<Receipts />} />
            <Route path="/exams/exam-schedule" element={<ExamSchedule />} />
            <Route path="/exams/marks-entry" element={<MarksEntry />} />
            <Route path="/exams/results" element={<Results />} />
            <Route path="/exams/report-cards" element={<ReportCards />} />
            <Route path="/timetable/class-timetable" element={<ClassTimetable />} />
            <Route path="/timetable/teacher-timetable" element={<TeacherTimetable />} />
            <Route path="/timetable/room-allocation" element={<RoomAllocation />} />
            <Route path="/communication/notices" element={<Notices />} />
            <Route path="/communication/email-sms-send" element={<EmailSMSSend />} />
            <Route path="/communication/parent-messages" element={<ParentMessages />} />
            <Route path="/parents/parent-list" element={<ParentList />} />
            <Route path="/parents/link-student" element={<LinkStudent />} />
            <Route path="/parents/parent-portal-access" element={<ParentPortalAccess />} />
            <Route path="/documents/upload-documents" element={<UploadDocuments />} />
            <Route path="/documents/certificates" element={<Certificates />} />
            <Route path="/documents/download-center" element={<DownloadCenter />} />
            <Route path="/reports/attendance-reports" element={<ReportsAttendanceReports />} />
            <Route path="/reports/academic-reports" element={<AcademicReports />} />
            <Route path="/reports/financial-reports" element={<FinancialReports />} />
            <Route path="/reports/export-pdf-excel" element={<ExportPDFExcel />} />
            <Route path="/administration/users" element={<Users />} />
            <Route path="/administration/roles-permissions" element={<RolesPermissions />} />
            <Route path="/administration/system-settings" element={<SystemSettings />} />
            <Route path="/administration/branch-school-setup" element={<BranchSchoolSetup />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
`;
fs.writeFileSync(appPath, appContent);

// 2. REPAIR APPSIDEBAR.TSX
const sidebarPath = path.join('frontend', 'src', 'layout', 'AppSidebar.tsx');
let sidebarContent = fs.readFileSync(sidebarPath, 'utf8');

// I am rewriting the navItems array part completely to be safe.
const navItemsString = `const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    subItems: [{ name: "Home", path: "/dashboard", pro: false }],
  },
  { name: "Students", icon: <PageIcon />, subItems: [
    { name: "Add Student", path: "/students/add-student", pro: false },
    { name: "Student List", path: "/students/student-list", pro: false },
    { name: "Student Profile", path: "/students/student-profile", pro: false },
    { name: "Enrollment / Admission", path: "/students/enrollment-admission", pro: false },
    { name: "Bulk Import", path: "/students/bulk-import", pro: false },
  ]},
  { name: "Staff", icon: <PageIcon />, subItems: [
    { name: "Add Teacher", path: "/staff/add-teacher", pro: false },
    { name: "Teacher List", path: "/staff/teacher-list", pro: false },
    { name: "Assign Subjects", path: "/staff/assign-subjects", pro: false },
    { name: "Staff Attendance", path: "/staff/staff-attendance", pro: false },
  ]},
  { name: "Academic", icon: <PageIcon />, subItems: [
    { name: "Classes / Grades", path: "/academic/classes-grades", pro: false },
    { name: "Subjects", path: "/academic/subjects", pro: false },
    { name: "Curriculum", path: "/academic/curriculum", pro: false },
    { name: "Academic Year Setup", path: "/academic/academic-year-setup", pro: false },
  ]},
  { name: "Attendance", icon: <PageIcon />, subItems: [
    { name: "Student Attendance", path: "/attendance/student-attendance", pro: false },
    { name: "Teacher Attendance", path: "/attendance/teacher-attendance", pro: false },
    { name: "Attendance Reports", path: "/attendance/attendance-reports", pro: false },
  ]},
  { name: "Fees", icon: <PageIcon />, subItems: [
    { name: "Fee Structure", path: "/fees/fee-structure", pro: false },
    { name: "Generate Invoices", path: "/fees/generate-invoices", pro: false },
    { name: "Payments", path: "/fees/payments", pro: false },
    { name: "Pending Fees", path: "/fees/pending-fees", pro: false },
    { name: "Receipts", path: "/fees/receipts", pro: false },
  ]},
  { name: "Exams", icon: <PageIcon />, subItems: [
    { name: "Exam Schedule", path: "/exams/exam-schedule", pro: false },
    { name: "Marks Entry", path: "/exams/marks-entry", pro: false },
    { name: "Results", path: "/exams/results", pro: false },
    { name: "Report Cards", path: "/exams/report-cards", pro: false },
  ]},
  { name: "Timetable", icon: <PageIcon />, subItems: [
    { name: "Class Timetable", path: "/timetable/class-timetable", pro: false },
    { name: "Teacher Timetable", path: "/timetable/teacher-timetable", pro: false },
    { name: "Room Allocation", path: "/timetable/room-allocation", pro: false },
  ]},
  { name: "Communication", icon: <PageIcon />, subItems: [
    { name: "Notices", path: "/communication/notices", pro: false },
    { name: "Email / SMS Send", path: "/communication/email-sms-send", pro: false },
    { name: "Parent Messages", path: "/communication/parent-messages", pro: false },
  ]},
  { name: "Parents", icon: <PageIcon />, subItems: [
    { name: "Parent List", path: "/parents/parent-list", pro: false },
    { name: "Link Student", path: "/parents/link-student", pro: false },
    { name: "Parent Portal Access", path: "/parents/parent-portal-access", pro: false },
  ]},
  { name: "Documents", icon: <PageIcon />, subItems: [
    { name: "Upload Documents", path: "/documents/upload-documents", pro: false },
    { name: "Certificates", path: "/documents/certificates", pro: false },
    { name: "Download Center", path: "/documents/download-center", pro: false },
  ]},
  { name: "Reports", icon: <PageIcon />, subItems: [
    { name: "Attendance Reports", path: "/reports/attendance-reports", pro: false },
    { name: "Academic Reports", path: "/reports/academic-reports", pro: false },
    { name: "Financial Reports", path: "/reports/financial-reports", pro: false },
    { name: "Export PDF/Excel", path: "/reports/export-pdf-excel", pro: false },
  ]},
  { name: "Administration", icon: <PageIcon />, subItems: [
    { name: "Users", path: "/administration/users", pro: false },
    { name: "Roles & Permissions", path: "/administration/roles-permissions", pro: false },
    { name: "System Settings", path: "/administration/system-settings", pro: false },
    { name: "Branch / School Setup", path: "/administration/branch-school-setup", pro: false },
  ]},
];`;

let parts = sidebarContent.split('const navItems: NavItem[] = [');
if(parts.length > 1) {
  let subParts = parts[1].split('const othersItems: NavItem[] = [');
  if(subParts.length > 1) {
    sidebarContent = parts[0] + navItemsString + '\n\nconst othersItems: NavItem[] = [' + subParts[1];
    fs.writeFileSync(sidebarPath, sidebarContent);
    console.log('AppSidebar.tsx fixed!');
  }
}
console.log('Done.');
