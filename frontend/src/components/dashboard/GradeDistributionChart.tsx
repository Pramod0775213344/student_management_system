// GradeDistributionChart - Professional animated bar chart
import { useState } from "react";

interface GradeData {
  grade: string;
  students: number;
  color: string;
  bg: string;
}

const gradeData: GradeData[] = [
  { grade: "Grade 6",  students: 145, color: "#60a5fa", bg: "bg-blue-400" },
  { grade: "Grade 7",  students: 162, color: "#818cf8", bg: "bg-indigo-400" },
  { grade: "Grade 8",  students: 178, color: "#a78bfa", bg: "bg-violet-400" },
  { grade: "Grade 9",  students: 191, color: "#34d399", bg: "bg-emerald-400" },
  { grade: "Grade 10", students: 203, color: "#465FFF", bg: "bg-brand-500" },
  { grade: "Grade 11", students: 184, color: "#f59e0b", bg: "bg-amber-500" },
  { grade: "Grade 12", students: 185, color: "#f87171", bg: "bg-red-400" },
];

const total = gradeData.reduce((s, d) => s + d.students, 0);
const maxStudents = Math.max(...gradeData.map((d) => d.students));

export default function GradeDistributionChart() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
            Students by Grade
          </h3>
          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
            2024–2025 Academic Year · {total.toLocaleString()} enrolled
          </p>
        </div>
        <span className="rounded-lg bg-brand-50 dark:bg-brand-900/30 px-2.5 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">
          7 Grades
        </span>
      </div>

      <div className="px-6 pt-5 pb-4">
        {/* Bars */}
        <div className="flex items-end gap-2 h-36 mb-3">
          {gradeData.map((item) => {
            const heightPct = (item.students / maxStudents) * 100;
            const isHov = hovered === item.grade;
            return (
              <div
                key={item.grade}
                className="flex flex-1 flex-col items-center gap-1 cursor-pointer"
                onMouseEnter={() => setHovered(item.grade)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Tooltip */}
                <div
                  className={`transition-all duration-150 ${
                    isHov ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"
                  }`}
                >
                  <div className="rounded-lg bg-gray-900 dark:bg-gray-700 px-2 py-1 text-center shadow-lg">
                    <p className="text-[10px] font-bold text-white">{item.students}</p>
                    <p className="text-[9px] text-gray-400">students</p>
                  </div>
                </div>

                {/* Bar */}
                <div
                  className="w-full rounded-t-lg transition-all duration-300"
                  style={{
                    height: `${(heightPct / 100) * 110}px`,
                    backgroundColor: item.color,
                    opacity: hovered && !isHov ? 0.4 : 1,
                    transform: isHov ? "scaleY(1.04)" : "scaleY(1)",
                    transformOrigin: "bottom",
                    boxShadow: isHov ? `0 -4px 12px ${item.color}55` : "none",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Labels */}
        <div className="flex gap-2">
          {gradeData.map((item) => (
            <div key={item.grade} className="flex-1 text-center">
              <span
                className="block text-[10px] font-medium truncate"
                style={{ color: hovered === item.grade ? item.color : undefined }}
              >
                {item.grade.replace("Grade ", "G")}
              </span>
            </div>
          ))}
        </div>

        {/* Horizontal legend pills */}
        <div className="mt-5 grid grid-cols-2 gap-2">
          {gradeData.map((item) => (
            <div
              key={item.grade}
              className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-white/[0.03] px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-2 w-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-gray-600 dark:text-gray-400">{item.grade}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-gray-800 dark:text-white">{item.students}</span>
                <span className="text-[10px] text-gray-400">
                  ({((item.students / total) * 100).toFixed(0)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
