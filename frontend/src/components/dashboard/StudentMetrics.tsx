// StudentMetrics - Professional stat cards with gradient icons & sparklines
import { GroupIcon, CheckCircleIcon, TimeIcon, TaskIcon, ArrowUpIcon, ArrowDownIcon } from "../../icons";

interface Stat {
  title: string;
  value: string;
  sub: string;
  trend: number; // positive = up, negative = down
  icon: React.ReactNode;
  gradient: string;
  sparkline: number[]; // 6 values for mini sparkline
}

const stats: Stat[] = [
  {
    title: "Total Students",
    value: "1,248",
    sub: "Enrolled this term",
    trend: 12,
    gradient: "from-brand-500 to-brand-400",
    icon: <GroupIcon className="size-5 text-white" />,
    sparkline: [40, 55, 48, 65, 72, 80],
  },
  {
    title: "Active Students",
    value: "1,189",
    sub: "Currently enrolled",
    trend: 3.2,
    gradient: "from-emerald-500 to-green-400",
    icon: <CheckCircleIcon className="size-5 text-white" />,
    sparkline: [60, 62, 58, 70, 75, 80],
  },
  {
    title: "Avg. Attendance",
    value: "87.4%",
    sub: "This month",
    trend: -2.1,
    gradient: "from-amber-500 to-orange-400",
    icon: <TimeIcon className="size-5 text-white" />,
    sparkline: [90, 88, 92, 85, 84, 87],
  },
  {
    title: "New Admissions",
    value: "42",
    sub: "This quarter",
    trend: 18,
    gradient: "from-violet-500 to-purple-400",
    icon: <TaskIcon className="size-5 text-white" />,
    sparkline: [10, 18, 14, 22, 32, 42],
  },
];

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 60;
  const h = 28;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");
  const area = [
    `0,${h}`,
    ...data.map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    }),
    `${w},${h}`,
  ].join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-16 h-7" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sg-${data[0]}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#sg-${data[0]})`} />
      <polyline points={pts} fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function StudentMetrics() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-5">
      {stats.map((s) => (
        <div
          key={s.title}
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${s.gradient} p-5 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200`}
        >
          {/* Background decoration circles */}
          <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10" />
          <div className="absolute -bottom-6 -right-2 h-16 w-16 rounded-full bg-white/10" />

          {/* Icon + Sparkline row */}
          <div className="relative flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 shadow-inner backdrop-blur-sm">
              {s.icon}
            </div>
            <Sparkline data={s.sparkline} />
          </div>

          {/* Value */}
          <div className="relative mt-4">
            <p className="text-3xl font-extrabold tracking-tight text-white">{s.value}</p>
            <p className="mt-1 text-xs font-medium text-white/70">{s.title}</p>
          </div>

          {/* Trend footer */}
          <div className="relative mt-4 flex items-center justify-between border-t border-white/20 pt-3">
            <span className="text-xs text-white/60">{s.sub}</span>
            <span
              className={`flex items-center gap-0.5 text-xs font-semibold ${
                s.trend >= 0 ? "text-white" : "text-red-200"
              }`}
            >
              {s.trend >= 0 ? (
                <ArrowUpIcon className="w-3 h-3" />
              ) : (
                <ArrowDownIcon className="w-3 h-3" />
              )}
              {Math.abs(s.trend)}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
