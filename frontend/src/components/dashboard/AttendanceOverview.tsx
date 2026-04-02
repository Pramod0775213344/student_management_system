// AttendanceOverview - Professional SVG line chart with gradient fill & stats
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

const W = 300;
const H = 90;
const PAD = 8;

function getCoords(data: { rate: number }[]) {
  const min = 70;
  const max = 100;
  return data.map((d, i) => ({
    x: PAD + (i / (data.length - 1)) * (W - PAD * 2),
    y: H - PAD - ((d.rate - min) / (max - min)) * (H - PAD * 2),
  }));
}

export default function AttendanceOverview() {
  const coords = getCoords(monthlyData);
  const linePts = coords.map((c) => `${c.x},${c.y}`).join(" ");
  const areaPts = [
    `${coords[0].x},${H}`,
    ...coords.map((c) => `${c.x},${c.y}`),
    `${coords[coords.length - 1].x},${H}`,
  ].join(" ");

  const avg = Math.round(monthlyData.reduce((s, d) => s + d.rate, 0) / monthlyData.length);
  const highest = Math.max(...monthlyData.map((d) => d.rate));
  const lowest = Math.min(...monthlyData.map((d) => d.rate));
  const last = monthlyData[monthlyData.length - 1].rate;
  const prev = monthlyData[monthlyData.length - 2].rate;
  const delta = last - prev;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
            Attendance Trend
          </h3>
          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
            Monthly rate (%) · 2024–2025
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold text-gray-800 dark:text-white leading-none">
            {last}%
          </p>
          <span
            className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${
              delta >= 0 ? "text-emerald-500" : "text-red-500"
            }`}
          >
            {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}% vs Nov
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="px-4 pt-4 pb-0">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          preserveAspectRatio="none"
          style={{ height: 90 }}
        >
          <defs>
            <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#465FFF" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#465FFF" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* horizontal grid lines */}
          {[75, 80, 85, 90, 95].map((r) => {
            const y = H - PAD - ((r - 70) / 30) * (H - PAD * 2);
            return (
              <line
                key={r}
                x1={PAD}
                y1={y}
                x2={W - PAD}
                y2={y}
                stroke="currentColor"
                strokeWidth="0.4"
                strokeDasharray="3,3"
                className="text-gray-200 dark:text-gray-700"
              />
            );
          })}

          {/* Area fill */}
          <polygon points={areaPts} fill="url(#attGrad)" />

          {/* Line */}
          <polyline
            points={linePts}
            fill="none"
            stroke="#465FFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dots */}
          {coords.map((c, i) => (
            <circle
              key={i}
              cx={c.x}
              cy={c.y}
              r={i === monthlyData.length - 1 ? 4 : 2.5}
              fill={i === monthlyData.length - 1 ? "#465FFF" : "white"}
              stroke="#465FFF"
              strokeWidth={i === monthlyData.length - 1 ? 2 : 1.5}
            />
          ))}
        </svg>

        {/* Month labels */}
        <div className="flex justify-between px-0 pb-3 mt-1">
          {monthlyData.map((d, i) => (
            <span
              key={d.month}
              className={`text-[9px] font-medium ${
                i === monthlyData.length - 1
                  ? "text-brand-500 dark:text-brand-400"
                  : "text-gray-400 dark:text-gray-600"
              }`}
            >
              {d.month}
            </span>
          ))}
        </div>
      </div>

      {/* Stats footer */}
      <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-800 border-t border-gray-100 dark:border-gray-800">
        {[
          { label: "Highest", value: `${highest}%`, color: "text-emerald-500" },
          { label: "Average", value: `${avg}%`, color: "text-gray-800 dark:text-white" },
          { label: "Lowest", value: `${lowest}%`, color: "text-red-500" },
        ].map((s) => (
          <div key={s.label} className="py-3 text-center">
            <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
