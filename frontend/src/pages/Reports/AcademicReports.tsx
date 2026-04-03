import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import GradeDistributionChart from "../../components/charts/GradeDistributionChart";
import SubjectPerformanceChart from "../../components/charts/SubjectPerformanceChart";

export default function AcademicReports() {
  // Mock data - Phase 3.2 eken backend summary endpoints walata connect karanawa
  const gradeData = [45, 82, 120, 65, 30, 12];
  const gradeCategories = ["A+", "A", "B+", "B", "C", "F"];

  const subjectData = [88, 72, 95, 64, 81];
  const subjectCategories = ["Mathematics", "Science", "History", "ICT", "English"];

  return (
    <div>
      <PageMeta
        title="Academic Reports | EduSphere"
        description="Comprehensive Academic Performance Analytics for EduSphere"
      />
      <PageBreadcrumb pageTitle="Academic Reports" />
      
      {/* Metric Cards - Summary Stats are essential for Schools */}
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Average GPA</p>
          <h3 className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">3.42</h3>
          <p className="mt-2 text-xs text-success-500 font-medium">↑ 0.12 from last term</p>
        </div>
        
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Passing Rate</p>
          <h3 className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">94.2%</h3>
          <p className="mt-2 text-xs text-success-500 font-medium">↑ 1.5% improvement</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Top Grade (A+)</p>
          <h3 className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">45</h3>
          <p className="mt-2 text-xs text-gray-400 font-medium text-sm">Students achieved A+</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Exams Conducted</p>
          <h3 className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">12</h3>
          <p className="mt-2 text-xs text-blue-500 font-medium">Term 1 Results Published</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Grade Distribution Chart */}
        <GradeDistributionChart data={gradeData} categories={gradeCategories} />

        {/* Subject-wise Performance Chart */}
        <SubjectPerformanceChart data={subjectData} categories={subjectCategories} />
      </div>

      {/* Additional Analytics - Table representation if needed */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">Subject-wise Summary</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="pb-3 font-semibold text-gray-800 dark:text-white/90 py-3">Subject</th>
                <th className="pb-3 font-semibold text-gray-800 dark:text-white/90">Avg Marks</th>
                <th className="pb-3 font-semibold text-gray-800 dark:text-white/90">Highest</th>
                <th className="pb-3 font-semibold text-gray-800 dark:text-white/90">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              <tr>
                <td className="py-4 text-gray-500 dark:text-gray-400">Mathematics</td>
                <td className="py-4 text-gray-500 dark:text-gray-400">82%</td>
                <td className="py-4 text-gray-500 dark:text-gray-400">98%</td>
                <td className="py-4"><span className="px-2 py-1 bg-success-50 text-success-600 rounded-full text-xs font-semibold px-3 py-1">Excellent</span></td>
              </tr>
              <tr>
                <td className="py-4 text-gray-500 dark:text-gray-400">Science</td>
                <td className="py-4 text-gray-500 dark:text-gray-400">75%</td>
                <td className="py-4 text-gray-500 dark:text-gray-400">92%</td>
                <td className="py-4"><span className="px-2 py-1 bg-warning-50 text-warning-600 rounded-full text-xs font-semibold px-3 py-1">Average</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
