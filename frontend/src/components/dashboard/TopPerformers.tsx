// TopPerformers - Professional ranking list with medal badges & score rings
interface TopPerformer {
  rank: number;
  name: string;
  image: string;
  grade: string;
  avgMarks: number;
  trend: "up" | "down" | "same";
  subject: string; // best subject
}

const topPerformers: TopPerformer[] = [
  { rank: 1, name: "Yasara Gunawardana",  image: "/images/user/user-20.jpg", grade: "Grade 12", avgMarks: 97, trend: "up",   subject: "Mathematics" },
  { rank: 2, name: "Amesh Liyanage",      image: "/images/user/user-19.jpg", grade: "Grade 11", avgMarks: 94, trend: "same", subject: "Science" },
  { rank: 3, name: "Sithara Wickrama",    image: "/images/user/user-17.jpg", grade: "Grade 12", avgMarks: 92, trend: "up",   subject: "Sinhala" },
  { rank: 4, name: "Kamal Perera",        image: "/images/user/user-18.jpg", grade: "Grade 10", avgMarks: 89, trend: "down", subject: "English" },
  { rank: 5, name: "Nimali Silva",        image: "/images/user/user-21.jpg", grade: "Grade 11", avgMarks: 87, trend: "up",   subject: "Geography" },
];

const medals: Record<number, { bg: string; text: string; emoji: string }> = {
  1: { bg: "bg-amber-400",    text: "text-amber-900", emoji: "🥇" },
  2: { bg: "bg-gray-300",     text: "text-gray-700",  emoji: "🥈" },
  3: { bg: "bg-orange-400",   text: "text-white",     emoji: "🥉" },
};

function ScoreRing({ score }: { score: number }) {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color =
    score >= 95 ? "#f59e0b" :
    score >= 90 ? "#22c55e" :
    score >= 80 ? "#465FFF" : "#94a3b8";

  return (
    <div className="relative flex-shrink-0">
      <svg width="44" height="44" viewBox="0 0 44 44" className="-rotate-90">
        <circle cx="22" cy="22" r={r} fill="none" stroke="currentColor" strokeWidth="3"
          className="text-gray-100 dark:text-gray-800" />
        <circle cx="22" cy="22" r={r} fill="none" stroke={color} strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ - dash}`} />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center text-[10px] font-extrabold"
        style={{ color }}
      >
        {score}
      </span>
    </div>
  );
}

function TrendBadge({ trend }: { trend: "up" | "down" | "same" }) {
  if (trend === "up")
    return (
      <span className="flex items-center gap-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
        ↑ Up
      </span>
    );
  if (trend === "down")
    return (
      <span className="flex items-center gap-0.5 rounded-full bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 text-[10px] font-bold text-red-500">
        ↓ Down
      </span>
    );
  return (
    <span className="flex items-center gap-0.5 rounded-full bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-[10px] font-bold text-gray-500 dark:text-gray-400">
      → Same
    </span>
  );
}

export default function TopPerformers() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Top Performers</h3>
          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
            Based on latest exam results
          </p>
        </div>
        <span className="rounded-lg bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
          🏆 Term 1 · 2025
        </span>
      </div>

      {/* Top 3 Podium Summary */}
      <div className="flex items-end justify-center gap-3 px-6 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800">
        {/* 2nd */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-gray-300">
            <img src={topPerformers[1].image} alt={topPerformers[1].name} className="h-full w-full object-cover" />
          </div>
          <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 text-center max-w-[60px] truncate">
            {topPerformers[1].name.split(" ")[0]}
          </span>
          <div className="flex h-8 w-14 items-center justify-center rounded-t-md bg-gray-200 dark:bg-gray-700">
            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">🥈 2nd</span>
          </div>
        </div>
        {/* 1st */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="h-12 w-12 overflow-hidden rounded-full ring-4 ring-amber-400 shadow-lg shadow-amber-200 dark:shadow-amber-900/30">
            <img src={topPerformers[0].image} alt={topPerformers[0].name} className="h-full w-full object-cover" />
          </div>
          <span className="text-[11px] font-bold text-gray-700 dark:text-gray-200 text-center max-w-[70px] truncate">
            {topPerformers[0].name.split(" ")[0]}
          </span>
          <div className="flex h-12 w-14 items-center justify-center rounded-t-md bg-amber-400">
            <span className="text-xs font-bold text-amber-900">🥇 1st</span>
          </div>
        </div>
        {/* 3rd */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-orange-400">
            <img src={topPerformers[2].image} alt={topPerformers[2].name} className="h-full w-full object-cover" />
          </div>
          <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 text-center max-w-[60px] truncate">
            {topPerformers[2].name.split(" ")[0]}
          </span>
          <div className="flex h-6 w-14 items-center justify-center rounded-t-md bg-orange-300 dark:bg-orange-800">
            <span className="text-xs font-bold text-orange-900 dark:text-orange-200">🥉 3rd</span>
          </div>
        </div>
      </div>

      {/* Full list */}
      <div className="divide-y divide-gray-50 dark:divide-gray-800/60">
        {topPerformers.map((s) => {
          const medal = medals[s.rank];
          return (
            <div
              key={s.rank}
              className="flex items-center gap-3.5 px-6 py-3 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group"
            >
              {/* Rank */}
              <div
                className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold ${
                  medal ? `${medal.bg} ${medal.text}` : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                }`}
              >
                {s.rank}
              </div>

              {/* Avatar */}
              <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-gray-100 dark:ring-gray-700">
                <img src={s.image} alt={s.name} className="h-full w-full object-cover" />
              </div>

              {/* Name + Subject */}
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold text-gray-800 dark:text-white/90 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors">
                  {s.name}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">
                  {s.grade} · Best: {s.subject}
                </p>
              </div>

              {/* Trend */}
              <TrendBadge trend={s.trend} />

              {/* Score ring */}
              <ScoreRing score={s.avgMarks} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
