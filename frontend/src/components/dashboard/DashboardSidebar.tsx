// DashboardSidebar - Professional donut status chart + quick actions
interface StatusSegment {
  label: string;
  count: number;
  color: string;
  lightBg: string;
  textColor: string;
}

const statusData: StatusSegment[] = [
  { label: "Active",    count: 1189, color: "#22c55e", lightBg: "bg-emerald-50 dark:bg-emerald-900/20", textColor: "text-emerald-600 dark:text-emerald-400" },
  { label: "Inactive",  count: 56,   color: "#f59e0b", lightBg: "bg-amber-50 dark:bg-amber-900/20",     textColor: "text-amber-600 dark:text-amber-400" },
  { label: "Suspended", count: 3,    color: "#ef4444", lightBg: "bg-red-50 dark:bg-red-900/20",          textColor: "text-red-600 dark:text-red-400" },
];

const total = statusData.reduce((s, d) => s + d.count, 0);

function DonutChart() {
  const r = 54;
  const circ = 2 * Math.PI * r;
  let cumulativeFrac = 0;
  const GAP = 0.015; // small gap between segments

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-40 w-40">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          {statusData.map((seg, i) => {
            const frac = seg.count / total;
            const dash = (frac - GAP) * circ;
            const gap = circ - dash;
            const offset = -(cumulativeFrac * circ);
            cumulativeFrac += frac;

            return (
              <circle
                key={i}
                cx="60" cy="60" r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth="14"
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="transition-all duration-300 hover:opacity-80 cursor-pointer"
              />
            );
          })}
          {/* Inner white ring */}
          <circle cx="60" cy="60" r="42" fill="white" className="dark:fill-gray-900" />
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold text-gray-800 dark:text-white leading-none">{total.toLocaleString()}</span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">Total</span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 w-full space-y-2">
        {statusData.map((seg) => {
          const pct = ((seg.count / total) * 100).toFixed(1);
          return (
            <div key={seg.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
                <span className="text-xs text-gray-600 dark:text-gray-400">{seg.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: seg.color }} />
                </div>
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 w-8 text-right">{seg.count}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface QuickAction {
  label: string;
  desc: string;
  href: string;
  icon: React.ReactNode;
  color: string;
  dotColor: string;
}

const quickActions: QuickAction[] = [
  {
    label: "Add New Student",
    desc: "Register a student",
    href: "/students/add",
    dotColor: "bg-brand-500",
    color: "hover:border-brand-300 dark:hover:border-brand-700 hover:bg-brand-50/50 dark:hover:bg-brand-900/10",
    icon: (
      <svg className="w-4 h-4 fill-current text-brand-500" viewBox="0 0 24 24">
        <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    ),
  },
  {
    label: "Student List",
    desc: "View & manage all",
    href: "/students",
    dotColor: "bg-emerald-500",
    color: "hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10",
    icon: (
      <svg className="w-4 h-4 fill-current text-emerald-500" viewBox="0 0 24 24">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    ),
  },
  {
    label: "Mark Attendance",
    desc: "Today's session",
    href: "/attendance",
    dotColor: "bg-amber-500",
    color: "hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50/50 dark:hover:bg-amber-900/10",
    icon: (
      <svg className="w-4 h-4 fill-current text-amber-500" viewBox="0 0 24 24">
        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
      </svg>
    ),
  },
  {
    label: "Generate Report",
    desc: "Export student data",
    href: "/reports",
    dotColor: "bg-violet-500",
    color: "hover:border-violet-300 dark:hover:border-violet-700 hover:bg-violet-50/50 dark:hover:bg-violet-900/10",
    icon: (
      <svg className="w-4 h-4 fill-current text-violet-500" viewBox="0 0 24 24">
        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
      </svg>
    ),
  },
];

export default function DashboardSidebar() {
  return (
    <div className="flex flex-col gap-5">
      {/* Status Donut Card */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Student Status</h3>
          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
            Distribution by enrollment status
          </p>
        </div>
        <div className="px-6 py-5">
          <DonutChart />
        </div>
      </div>

      {/* Quick Actions Card */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Quick Actions</h3>
          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
            Common tasks at a glance
          </p>
        </div>
        <div className="px-5 py-4 grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <a
              key={action.label}
              href={action.href}
              className={`group flex flex-col gap-2.5 rounded-xl border border-gray-200 dark:border-gray-700 p-4 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm ${action.color}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800 group-hover:scale-110 transition-transform">
                  {action.icon}
                </div>
                <span className={`h-2 w-2 rounded-full ${action.dotColor}`} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 leading-tight">
                  {action.label}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{action.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
