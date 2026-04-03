import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import AttendanceTrendChart from "../../components/charts/AttendanceTrendChart";

export default function ReportsAttendanceReports() {
  // Mock data - Phase 3.2 eken backend summary endpoints walata connect karanawa
  const trendData = [85, 88, 92, 80, 78, 85, 90];
  const trendCategories = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div>
      <PageMeta
        title="Attendance Reports | EduSphere"
        description="Comprehensive Attendance Analytics for EduSphere"
      />
      <PageBreadcrumb pageTitle="Attendance Reports" />

      {/* Metric Cards - Summary Stats for Attendance */}
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Attendance %</p>
          <h3 className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">86.4%</h3>
          <p className="mt-2 text-xs text-error-500 font-medium">↓ 2.1% from last week</p>
        </div>
        
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Students Present (Today)</p>
          <h3 className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">242</h3>
          <p className="mt-2 text-xs text-success-500 font-medium">92% of total students</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Absentees / Week</p>
          <h3 className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">18</h3>
          <p className="mt-2 text-xs text-gray-400 font-medium capitalize">Consistent with term avg</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">At-Risk Students (&lt; 75%)</p>
          <h3 className="mt-1 text-2xl font-bold text-error-500">12</h3>
          <p className="mt-2 text-xs text-error-500 font-medium italic">Action required immediately</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Attendance Trend Chart eka display karanawa */}
        <AttendanceTrendChart data={trendData} categories={trendCategories} />
      </div>

      {/* At-Risk Students Table - 75% rule eka flag karana table eka */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">At-Risk Students (Attendance &lt; 75%)</h4>
          <span className="px-3 py-1 text-xs font-medium bg-error-50 text-error-600 rounded-full">Exams Restricted</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 py-3">
                <th className="pb-3 px-4 font-semibold text-gray-800 dark:text-white/90 py-3">Student Name</th>
                <th className="pb-3 px-4 font-semibold text-gray-800 dark:text-white/90">Student ID</th>
                <th className="pb-3 px-4 font-semibold text-gray-800 dark:text-white/90">Current %</th>
                <th className="pb-3 px-4 font-semibold text-gray-800 dark:text-white/90">Days Absent</th>
                <th className="pb-3 px-4 font-semibold text-gray-800 dark:text-white/90">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              <tr>
                <td className="py-4 px-4 text-gray-500 dark:text-gray-400">Kamal Perera</td>
                <td className="py-4 px-4 text-gray-500 dark:text-gray-400">STU0042</td>
                <td className="py-4 px-4 text-error-500 font-bold">68%</td>
                <td className="py-4 px-4 text-gray-500 dark:text-gray-400">12 Days</td>
                <td className="py-4 px-4"><span className="px-2 py-1 bg-error-50 text-error-600 rounded-full text-xs font-semibold px-3 py-1">Ineligible</span></td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-gray-500 dark:text-gray-400">Sunil Shantha</td>
                <td className="py-4 px-4 text-gray-500 dark:text-gray-400">STU0112</td>
                <td className="py-4 px-4 text-warning-500 font-bold">72%</td>
                <td className="py-4 px-4 text-gray-500 dark:text-gray-400">10 Days</td>
                <td className="py-4 px-4"><span className="px-2 py-1 bg-warning-50 text-warning-600 rounded-full text-xs font-semibold px-3 py-1">Warning</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
