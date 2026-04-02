// EduSphere - Student Management System Dashboard
// Professional, premium dashboard layout

import PageMeta from "../../components/common/PageMeta";
import StudentMetrics from "../../components/dashboard/StudentMetrics";
import GradeDistributionChart from "../../components/dashboard/GradeDistributionChart";
import AttendanceOverview from "../../components/dashboard/AttendanceOverview";
import RecentStudents from "../../components/dashboard/RecentStudents";
import TopPerformers from "../../components/dashboard/TopPerformers";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Dashboard | EduSphere - Student Management System"
        description="EduSphere Student Management System - Overview dashboard with student metrics, attendance, and performance data"
      />

      {/* ---- Main Grid ---- */}
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* ---- LEFT MAIN CONTENT (col-span 8) ---- */}
        <div className="col-span-12 xl:col-span-8 flex flex-col gap-4 md:gap-6">
          {/* Metric Cards - 4 stats across */}
          <StudentMetrics />

          {/* Charts row */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            <GradeDistributionChart />
            <AttendanceOverview />
          </div>

          {/* Recent Admissions table */}
          <RecentStudents />
        </div>

        {/* ── RIGHT: Sidebar ── */}
        <div className="col-span-12 xl:col-span-4 flex flex-col gap-4 md:gap-5">
          {/* Top Performers (podium + list) */}
          <TopPerformers />

          {/* Status donut + Quick actions */}
          <DashboardSidebar />
        </div>
      </div>
    </>
  );
}
