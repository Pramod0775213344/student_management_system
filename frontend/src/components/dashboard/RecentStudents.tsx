// RecentStudents - Professional table with hover states & action buttons
import Badge from "../ui/badge/Badge";

interface RecentStudent {
  id: string;
  name: string;
  image: string;
  grade: string;
  section: string;
  admissionDate: string;
  status: "Active" | "Inactive" | "Suspended";
  avgMark: number;
}

const recentStudents: RecentStudent[] = [
  { id: "STD-048", name: "Kavindi Rathnayake",    image: "/images/user/user-17.jpg", grade: "Grade 9",  section: "A", admissionDate: "2025-03-28", status: "Active",    avgMark: 88 },
  { id: "STD-047", name: "Tharindu Bandara",      image: "/images/user/user-19.jpg", grade: "Grade 11", section: "B", admissionDate: "2025-03-25", status: "Active",    avgMark: 76 },
  { id: "STD-046", name: "Isuri Wickramasinghe",  image: "/images/user/user-20.jpg", grade: "Grade 7",  section: "A", admissionDate: "2025-03-22", status: "Active",    avgMark: 91 },
  { id: "STD-045", name: "Pasindu Gamage",        image: "/images/user/user-21.jpg", grade: "Grade 10", section: "C", admissionDate: "2025-03-20", status: "Inactive",  avgMark: 62 },
  { id: "STD-044", name: "Dilani Fernando",       image: "/images/user/user-18.jpg", grade: "Grade 12", section: "A", admissionDate: "2025-03-18", status: "Active",    avgMark: 95 },
  { id: "STD-043", name: "Sachith Jayawardena",   image: "/images/user/user-17.jpg", grade: "Grade 8",  section: "B", admissionDate: "2025-03-15", status: "Suspended", avgMark: 55 },
];

function Avatar({ src, name }: { src: string; name: string }) {
  return (
    <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-gray-100 dark:ring-gray-700">
      <img src={src} alt={name} className="h-full w-full object-cover" />
    </div>
  );
}

function MarkBar({ mark }: { mark: number }) {
  const color =
    mark >= 90 ? "bg-emerald-500" :
    mark >= 75 ? "bg-brand-500" :
    mark >= 60 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${mark}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 w-8">{mark}%</span>
    </div>
  );
}

export default function RecentStudents() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Recent Admissions</h3>
          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
            Latest {recentStudents.length} students registered
          </p>
        </div>
        <a
          href="/students"
          className="flex items-center gap-1 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors"
        >
          View All
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      {/* Table header */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2.5 bg-gray-50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-gray-800">
        {["Student", "ID", "Grade", "Avg. Mark", "Admitted", "Status", ""].map((h, i) => (
          <div
            key={i}
            className={`text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 ${
              i === 0 ? "col-span-3" : i === 3 ? "col-span-2" : "col-span-1"
            } ${i === 6 ? "text-right" : ""}`}
          >
            {h}
          </div>
        ))}
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-50 dark:divide-gray-800/60">
        {recentStudents.map((s) => (
          <div
            key={s.id}
            className="grid grid-cols-12 items-center gap-4 px-6 py-3.5 hover:bg-gray-50/70 dark:hover:bg-white/[0.02] transition-colors group"
          >
            {/* Name */}
            <div className="col-span-12 md:col-span-3 flex items-center gap-3">
              <Avatar src={s.image} name={s.name} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-800 dark:text-white group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors">
                  {s.name}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 md:hidden">{s.id}</p>
              </div>
            </div>

            {/* ID */}
            <div className="hidden md:block col-span-1">
              <span className="text-xs font-mono text-gray-500 dark:text-gray-400">{s.id}</span>
            </div>

            {/* Grade */}
            <div className="hidden md:block col-span-1">
              <span className="rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-300">
                {s.grade.replace("Grade ", "G")} – {s.section}
              </span>
            </div>

            {/* Avg Mark */}
            <div className="hidden md:block col-span-2">
              <MarkBar mark={s.avgMark} />
            </div>

            {/* Date */}
            <div className="hidden md:block col-span-1">
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {new Date(s.admissionDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                })}
              </span>
            </div>

            {/* Status */}
            <div className="hidden md:block col-span-1">
              <Badge
                size="sm"
                color={
                  s.status === "Active" ? "success" :
                  s.status === "Inactive" ? "warning" : "error"
                }
              >
                {s.status}
              </Badge>
            </div>

            {/* Actions */}
            <div className="hidden md:flex col-span-3 justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                title="View Profile"
                className="rounded-lg p-1.5 text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                </svg>
              </button>
              <button
                title="Edit"
                className="rounded-lg p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
              </button>
              <button
                title="Delete"
                className="rounded-lg p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
