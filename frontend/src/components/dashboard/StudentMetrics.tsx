import Chart from "react-apexcharts";
import { GroupIcon, CheckCircleIcon, TimeIcon, TaskIcon, ArrowUpIcon, ArrowDownIcon } from "../../icons";
import { ApexOptions } from "apexcharts";

interface Stat {
  title: string;
  value: string;
  sub: string;
  trend: number;
  icon: React.ReactNode;
  color: string;
  sparkline: number[];
}

const stats: Stat[] = [
  {
    title: "Total Students",
    value: "1,248",
    sub: "Enrolled this term",
    trend: 12,
    color: "#465FFF",
    icon: <GroupIcon className="size-5 text-white" />,
    sparkline: [40, 55, 48, 65, 72, 80],
  },
  {
    title: "Active Students",
    value: "1,189",
    sub: "Currently enrolled",
    trend: 3.2,
    color: "#10b981",
    icon: <CheckCircleIcon className="size-5 text-white" />,
    sparkline: [60, 62, 58, 70, 75, 80],
  },
  {
    title: "Avg. Attendance",
    value: "87.4%",
    sub: "This month",
    trend: -2.1,
    color: "#f59e0b",
    icon: <TimeIcon className="size-5 text-white" />,
    sparkline: [90, 88, 92, 85, 84, 87],
  },
  {
    title: "New Admissions",
    value: "42",
    sub: "This quarter",
    trend: 18,
    color: "#8b5cf6",
    icon: <TaskIcon className="size-5 text-white" />,
    sparkline: [10, 18, 14, 22, 32, 42],
  },
];

export default function StudentMetrics() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-6">
      {stats.map((s) => {
        const chartOptions: ApexOptions = {
          chart: {
            type: "area",
            sparkline: { enabled: true },
            animations: { enabled: true, speed: 800 },
          },
          stroke: { curve: "smooth", width: 2 },
          fill: {
            type: "gradient",
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.45,
              opacityTo: 0.05,
              stops: [20, 100],
            },
          },
          colors: [s.color],
          tooltip: { enabled: false },
        };

        return (
          <div
            key={s.title}
            className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-xl dark:border-gray-800 dark:bg-white/[0.03]"
          >
            {/* Header: Icon + Trend */}
            <div className="flex items-start justify-between">
              <div 
                className="flex h-11 w-11 items-center justify-center rounded-xl shadow-lg transition-transform group-hover:scale-110"
                style={{ backgroundColor: s.color }}
              >
                {s.icon}
              </div>
              <div
                className={`flex items-center gap-0.5 rounded-full px-2 py-1 text-[10px] font-bold ${
                  s.trend >= 0 
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" 
                    : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                }`}
              >
                {s.trend >= 0 ? <ArrowUpIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />}
                {Math.abs(s.trend)}%
              </div>
            </div>

            {/* Info */}
            <div className="mt-4">
              <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {s.value}
              </h3>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {s.title}
              </p>
            </div>

            {/* Sparkline Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-14 opacity-50 group-hover:opacity-100 transition-opacity">
              <Chart
                options={chartOptions}
                series={[{ name: s.title, data: s.sparkline }]}
                type="area"
                height={60}
              />
            </div>

            {/* Subtext */}
            <div className="mt-4 flex items-center text-[10px] text-gray-400 dark:text-gray-500">
               {s.sub}
            </div>
          </div>
        );
      })}
    </div>
  );
}
