import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import FinancialStatusChart from "../../components/charts/FinancialStatusChart";
import RevenueTrendChart from "../../components/charts/RevenueTrendChart";

export default function FinancialReports() {
  // Mock data - Phase 3.2 eken backend summary endpoints walata connect karanawa
  const revenueTrendData = [120000, 150000, 140000, 180000, 210000, 195000, 225000];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

  const statusData = [65, 25, 10]; // Paid, Pending, Overdue
  const statusLabels = ["Paid", "Pending", "Overdue"];

  return (
    <div>
      <PageMeta
        title="Financial Reports | EduSphere"
        description="Comprehensive Financial Analytics for EduSphere"
      />
      <PageBreadcrumb pageTitle="Financial Reports" />

      {/* Metric Cards - Summary Stats for Finances */}
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Collected</p>
          <h3 className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">Rs. 1.24M</h3>
          <p className="mt-2 text-xs text-success-500 font-medium">↑ 8% from last month</p>
        </div>
        
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Pending</p>
          <h3 className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">Rs. 345K</h3>
          <p className="mt-2 text-xs text-warning-500 font-medium italic">25% of total fees</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Overdue Amount</p>
          <h3 className="mt-1 text-2xl font-bold text-error-500 font-bold">Rs. 84.5K</h3>
          <p className="mt-2 text-xs text-error-500 font-medium">Auto-penalties applied</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">System Collections</p>
          <h3 className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">92%</h3>
          <p className="mt-2 text-xs text-success-500 font-medium">Efficiency improved</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Trend Chart eka display karanawa */}
        <RevenueTrendChart data={revenueTrendData} categories={months} />

        {/* Collection Status Donut Chart eka display karanawa */}
        <FinancialStatusChart data={statusData} labels={statusLabels} />
      </div>

      {/* Transaction History Summary Table */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">Recent Fee Collections</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 py-3">
                <th className="pb-3 px-4 font-semibold text-gray-800 dark:text-white/90 py-3">Student</th>
                <th className="pb-3 px-4 font-semibold text-gray-800 dark:text-white/90">Amount</th>
                <th className="pb-3 px-4 font-semibold text-gray-800 dark:text-white/90">Date</th>
                <th className="pb-3 px-4 font-semibold text-gray-800 dark:text-white/90">Type</th>
                <th className="pb-3 px-4 font-semibold text-gray-800 dark:text-white/90">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              <tr>
                <td className="py-4 px-4 text-gray-500 dark:text-gray-400">Kamal Perera</td>
                <td className="py-4 px-4 text-gray-500 dark:text-gray-400 font-medium">Rs. 15,000</td>
                <td className="py-4 px-4 text-gray-500 dark:text-gray-400">2026-04-03</td>
                <td className="py-4 px-4 text-gray-500 dark:text-gray-400 text-sm italic">Tuition Fee</td>
                <td className="py-4 px-4"><span className="px-2 py-1 bg-success-50 text-success-600 rounded-full text-xs font-semibold px-3 py-1">Success</span></td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-gray-500 dark:text-gray-400">Nimal Silva</td>
                <td className="py-4 px-4 text-gray-500 dark:text-gray-400 font-medium">Rs. 5,000</td>
                <td className="py-4 px-4 text-gray-500 dark:text-gray-400">2026-04-02</td>
                <td className="py-4 px-4 text-gray-500 dark:text-gray-400 text-sm italic">Library Fee</td>
                <td className="py-4 px-4"><span className="px-2 py-1 bg-warning-50 text-warning-600 rounded-full text-xs font-semibold px-3 py-1">Pending</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
