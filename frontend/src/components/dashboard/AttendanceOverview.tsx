import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const monthlyData = [
  { month: "Jan", rate: 91 },
  { month: "Feb", rate: 88 },
  { month: "Mar", rate: 85 },
  { month: "Apr", rate: 89 },
  { month: "May", rate: 92 },
  { month: "Jun", rate: 76 },
  { month: "Jul", rate: 83 },
  { month: "Aug", rate: 87 },
  { month: "Sep", rate: 90 },
  { month: "Oct", rate: 88 },
  { month: "Nov", rate: 86 },
  { month: "Dec", rate: 82 },
];

export default function AttendanceOverview() {
  const avg = Math.round(monthlyData.reduce((s, d) => s + d.rate, 0) / monthlyData.length);
  const highest = Math.max(...monthlyData.map((d) => d.rate));
  const lowest = Math.min(...monthlyData.map((d) => d.rate));
  const last = monthlyData[monthlyData.length - 1].rate;
  const prev = monthlyData[monthlyData.length - 2].rate;
  const delta = last - prev;

  const chartOptions: ApexOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      animations: { enabled: true, speed: 800 },
    },
    stroke: { curve: "smooth", width: 3 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 100],
      },
    },
    dataLabels: { enabled: false },
    grid: {
      strokeDashArray: 5,
      borderColor: "#e2e8f0",
    },
    colors: ["#465FFF"],
    xaxis: {
      categories: monthlyData.map((d) => d.month),
      labels: { style: { colors: "#94a3b8", fontSize: "10px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 60,
      max: 100,
      labels: { style: { colors: "#94a3b8", fontSize: "10px" } },
    },
    tooltip: {
      theme: "dark",
      x: { show: true },
      y: { formatter: (val) => `${val}%` },
    },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Attendance Trend</h3>
          <p className="mt-1 text-xs text-gray-500">Monthly Average (%) · 2024–2025</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{last}%</p>
          <span className={`text-[11px] font-bold ${delta >= 0 ? "text-emerald-500" : "text-red-500"}`}>
            {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}% <span className="font-medium text-gray-400">vs Prev</span>
          </span>
        </div>
      </div>

      <div className="h-[200px]">
        <Chart
          options={chartOptions}
          series={[{ name: "Attendance", data: monthlyData.map((d) => d.rate) }]}
          type="area"
          height="100%"
        />
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4">
        {[
          { label: "Highest", value: `${highest}%`, color: "text-emerald-500" },
          { label: "Average", value: `${avg}%`, color: "text-brand-500" },
          { label: "Lowest", value: `${lowest}%`, color: "text-red-500" },
        ].map((s) => (
          <div key={s.label} className="text-center flex-1">
            <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
