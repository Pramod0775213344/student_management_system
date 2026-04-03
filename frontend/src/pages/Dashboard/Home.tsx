import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import StudentMetrics from "../../components/dashboard/StudentMetrics";
import GradeDistributionChart from "../../components/dashboard/GradeDistributionChart";
import AttendanceOverview from "../../components/dashboard/AttendanceOverview";
import RecentStudents from "../../components/dashboard/RecentStudents";
import TopPerformers from "../../components/dashboard/TopPerformers";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import DateRangePicker from "../../components/form/DateRangePicker";

export default function Home() {
  const [dateRange, setDateRange] = useState("Last 30 Days");

  return (
    <>
      <PageMeta
        title="Dashboard | EduSphere - Student Management System"
        description="EduSphere Student Management System - Overview dashboard with student metrics, attendance, and performance data"
      />

      <div className="space-y-6">
        {/* ---- Dashboard Header ---- */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">EduSphere Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Welcome back, Admin! Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-3">
             <DateRangePicker value={dateRange} onChange={setDateRange} />
          </div>
        </div>

        {/* ---- Top Metrics ---- */}
        <StudentMetrics />

        {/* ---- Main Content Grid ---- */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* LEFT: Charts and History */}
          <div className="col-span-12 space-y-6 xl:col-span-8">
            
            {/* Charts Row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <AttendanceOverview />
              <GradeDistributionChart />
            </div>

            {/* Tables / Lists */}
            <RecentStudents />
          </div>

          {/* RIGHT: Sidebar and Leaderboard */}
          <div className="col-span-12 space-y-6 xl:col-span-4">
            <TopPerformers />
            <DashboardSidebar />
          </div>

        </div>
      </div>
    </>
  );
}
