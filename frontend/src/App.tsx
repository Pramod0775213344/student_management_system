import SignIn from "./pages/AuthPages/SignIn";
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
import { Toaster } from "react-hot-toast";

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
import CreateUser from './pages/Administration/CreateUser';

const ProtectedRoute = ({ children, allowedRoles }: { children: ReactNode; allowedRoles?: string[] }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role;

  if (!token) {
    return <Navigate to="/signin" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Role eka match wenne naththam dashboard ekata auto redirect karanawa
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default function App() {
  return (
    <>
      <Toaster 
        position="top-right" 
        reverseOrder={false} 
        containerStyle={{ 
          top: 80,
          zIndex: 999999 
        }} 
        toastOptions={{
          style: {
            background: "rgba(16, 24, 40, 0.85)", // Dark Gray 900 with opacity
            backdropFilter: "blur(12px)", // Modern glassmorphism blur
            color: "#fff",
            borderRadius: "16px",
            fontSize: "14px",
            fontWeight: "600",
            padding: "14px 24px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
          },
          success: {
            style: {
              background: "rgba(3, 152, 85, 0.9)", // Success 600 with opacity
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#039855",
            },
          },
          error: {
            style: {
              background: "rgba(217, 45, 32, 0.9)", // Error 600 with opacity
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#d92d20",
            },
          },
        }}
      />
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Navigate to="/signin" replace />} />
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
            {/* Student Management: Admins and Teachers only */}
            <Route path="/students/add-student" element={<ProtectedRoute allowedRoles={['admin']}><AddStudent /></ProtectedRoute>} />
            <Route path="/students/edit-student/:id" element={<ProtectedRoute allowedRoles={['admin']}><AddStudent /></ProtectedRoute>} />
            <Route path="/students/student-list" element={<ProtectedRoute allowedRoles={['admin', 'teacher']}><StudentList /></ProtectedRoute>} />
            <Route path="/students/student-profile/:id" element={<ProtectedRoute allowedRoles={['admin', 'teacher']}><StudentProfile /></ProtectedRoute>} />
            <Route path="/students/enrollment-admission" element={<ProtectedRoute allowedRoles={['admin']}><EnrollmentAdmission /></ProtectedRoute>} />
            <Route path="/students/bulk-import" element={<ProtectedRoute allowedRoles={['admin']}><BulkImport /></ProtectedRoute>} />

            {/* Staff Management: Admin only */}
            <Route path="/staff/add-teacher" element={<ProtectedRoute allowedRoles={['admin']}><AddTeacher /></ProtectedRoute>} />
            <Route path="/staff/teacher-list" element={<ProtectedRoute allowedRoles={['admin', 'teacher']}><TeacherList /></ProtectedRoute>} />
            <Route path="/staff/assign-subjects" element={<ProtectedRoute allowedRoles={['admin']}><AssignSubjects /></ProtectedRoute>} />
            <Route path="/staff/staff-attendance" element={<ProtectedRoute allowedRoles={['admin']}><StaffAttendance /></ProtectedRoute>} />

            {/* Academic Setup: Admin only */}
            <Route path="/academic/classes-grades" element={<ProtectedRoute allowedRoles={['admin']}><ClassesGrades /></ProtectedRoute>} />
            <Route path="/academic/subjects" element={<ProtectedRoute allowedRoles={['admin']}><Subjects /></ProtectedRoute>} />
            <Route path="/academic/curriculum" element={<ProtectedRoute allowedRoles={['admin']}><Curriculum /></ProtectedRoute>} />
            <Route path="/academic/academic-year-setup" element={<ProtectedRoute allowedRoles={['admin']}><AcademicYearSetup /></ProtectedRoute>} />

            {/* Attendance: Admin and Teacher */}
            <Route path="/attendance/student-attendance" element={<ProtectedRoute allowedRoles={['admin', 'teacher']}><StudentAttendance /></ProtectedRoute>} />
            <Route path="/attendance/teacher-attendance" element={<ProtectedRoute allowedRoles={['admin']}><TeacherAttendance /></ProtectedRoute>} />
            <Route path="/attendance/attendance-reports" element={<ProtectedRoute allowedRoles={['admin', 'teacher']}><AttendanceReports /></ProtectedRoute>} />

            {/* Fees: Admin only */}
            <Route path="/fees/fee-structure" element={<ProtectedRoute allowedRoles={['admin']}><FeeStructure /></ProtectedRoute>} />
            <Route path="/fees/generate-invoices" element={<ProtectedRoute allowedRoles={['admin']}><GenerateInvoices /></ProtectedRoute>} />
            <Route path="/fees/payments" element={<ProtectedRoute allowedRoles={['admin']}><Payments /></ProtectedRoute>} />
            <Route path="/fees/pending-fees" element={<ProtectedRoute allowedRoles={['admin']}><PendingFees /></ProtectedRoute>} />
            <Route path="/fees/receipts" element={<ProtectedRoute allowedRoles={['admin']}><Receipts /></ProtectedRoute>} />

            {/* Exams: Admin and Teacher */}
            <Route path="/exams/exam-schedule" element={<ProtectedRoute allowedRoles={['admin', 'teacher']}><ExamSchedule /></ProtectedRoute>} />
            <Route path="/exams/marks-entry" element={<ProtectedRoute allowedRoles={['admin', 'teacher']}><MarksEntry /></ProtectedRoute>} />
            <Route path="/exams/results" element={<ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}><Results /></ProtectedRoute>} />
            <Route path="/exams/report-cards" element={<ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}><ReportCards /></ProtectedRoute>} />

            {/* Timetable: All can view (mostly) */}
            <Route path="/timetable/class-timetable" element={<ClassTimetable />} />
            <Route path="/timetable/teacher-timetable" element={<TeacherTimetable />} />
            <Route path="/timetable/room-allocation" element={<ProtectedRoute allowedRoles={['admin']}><RoomAllocation /></ProtectedRoute>} />

            {/* Communication: Admin and Teacher */}
            <Route path="/communication/notices" element={<ProtectedRoute allowedRoles={['admin', 'teacher']}><Notices /></ProtectedRoute>} />
            <Route path="/communication/email-sms-send" element={<ProtectedRoute allowedRoles={['admin']}><EmailSMSSend /></ProtectedRoute>} />
            <Route path="/communication/parent-messages" element={<ProtectedRoute allowedRoles={['admin', 'teacher']}><ParentMessages /></ProtectedRoute>} />

            {/* Parents: Admin only */}
            <Route path="/parents/parent-list" element={<ProtectedRoute allowedRoles={['admin']}><ParentList /></ProtectedRoute>} />
            <Route path="/parents/link-student" element={<ProtectedRoute allowedRoles={['admin']}><LinkStudent /></ProtectedRoute>} />
            <Route path="/parents/parent-portal-access" element={<ProtectedRoute allowedRoles={['admin']}><ParentPortalAccess /></ProtectedRoute>} />

            {/* Documents: Admin and Teacher */}
            <Route path="/documents/upload-documents" element={<ProtectedRoute allowedRoles={['admin', 'teacher']}><UploadDocuments /></ProtectedRoute>} />
            <Route path="/documents/certificates" element={<ProtectedRoute allowedRoles={['admin', 'teacher']}><Certificates /></ProtectedRoute>} />
            <Route path="/documents/download-center" element={<DownloadCenter />} />

            {/* Reports: Admin and Teacher */}
            <Route path="/reports/attendance-reports" element={<ProtectedRoute allowedRoles={['admin', 'teacher']}><ReportsAttendanceReports /></ProtectedRoute>} />
            <Route path="/reports/academic-reports" element={<ProtectedRoute allowedRoles={['admin', 'teacher']}><AcademicReports /></ProtectedRoute>} />
            <Route path="/reports/financial-reports" element={<ProtectedRoute allowedRoles={['admin']}><FinancialReports /></ProtectedRoute>} />
            <Route path="/reports/export-pdf-excel" element={<ProtectedRoute allowedRoles={['admin']}><ExportPDFExcel /></ProtectedRoute>} />

            {/* Administration: Admin only */}
            <Route path="/administration/users" element={<ProtectedRoute allowedRoles={['admin']}><Users /></ProtectedRoute>} />
            <Route path="/administration/roles-permissions" element={<ProtectedRoute allowedRoles={['admin']}><RolesPermissions /></ProtectedRoute>} />
            <Route path="/administration/system-settings" element={<ProtectedRoute allowedRoles={['admin']}><SystemSettings /></ProtectedRoute>} />
            <Route path="/administration/branch-school-setup" element={<ProtectedRoute allowedRoles={['admin']}><BranchSchoolSetup /></ProtectedRoute>} />
            <Route path="/administration/create-user" element={<ProtectedRoute allowedRoles={['admin']}><CreateUser /></ProtectedRoute>} />

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
