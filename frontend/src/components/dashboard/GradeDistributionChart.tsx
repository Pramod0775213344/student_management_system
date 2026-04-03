import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const gradeData = [
  { grade: "Grade 6",  students: 145, color: "#60a5fa" },
  { grade: "Grade 7",  students: 162, color: "#818cf8" },
  { grade: "Grade 8",  students: 178, color: "#a78bfa" },
  { grade: "Grade 9",  students: 191, color: "#34d399" },
  { grade: "Grade 10", students: 203, color: "#465FFF" },
  { grade: "Grade 11", students: 184, color: "#f59e0b" },
  { grade: "Grade 12", students: 185, color: "#f87171" },
];

export default function GradeDistributionChart() {
  const total = gradeData.reduce((s, d) => s + d.students, 0);

  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      animations: { enabled: true, easing: "easeinout", speed: 800 },
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: "45%",
        distributed: true,
        dataLabels: { position: "top" },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => val,
      offsetY: -20,
      style: { fontSize: "10px", colors: ["#64748b"] },
    },
    colors: gradeData.map((d) => d.color),
    xaxis: {
      categories: gradeData.map((d) => d.grade.replace("Grade ", "G")),
      labels: { style: { colors: "#94a3b8", fontSize: "10px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { show: false },
    },
    grid: { show: false },
    legend: { show: false },
    tooltip: {
      theme: "dark",
      y: { formatter: (val) => `${val} Students` },
    },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Students by Grade</h3>
          <p className="mt-1 text-xs text-gray-500">2024–2025 Year · {total.toLocaleString()} total</p>
        </div>
        <span className="rounded-lg bg-brand-50 px-2 py-1 text-[11px] font-bold text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
          7 Grades Active
        </span>
      </div>

      <div className="h-[200px]">
        <Chart
          options={chartOptions}
          series={[{ name: "Students", data: gradeData.map((d) => d.students) }]}
          type="bar"
          height="100%"
        />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800 pt-4">
        {gradeData.slice(-2).map((item) => (
          <div key={item.grade} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
            <p className="text-[11px] text-gray-600 dark:text-gray-400 font-medium">{item.grade}: <span className="font-bold text-gray-900 dark:text-white">{item.students}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
}
