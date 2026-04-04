import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { toast } from "react-hot-toast";

// Subject color mapping for professional look
const subjectColors: Record<string, string> = {
  Mathematics: "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400",
  Science: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400",
  English: "bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-500/10 dark:border-purple-500/20 dark:text-purple-400",
  History: "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400",
  ICT: "bg-cyan-50 border-cyan-200 text-cyan-700 dark:bg-cyan-500/10 dark:border-cyan-500/20 dark:text-cyan-400",
  Physics: "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400",
  Chemistry: "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-400",
  Default: "bg-gray-50 border-gray-200 text-gray-700 dark:bg-white/5 dark:border-white/10 dark:text-gray-400",
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const timeSlots = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM"];

interface TimetableEntry {
  _id: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: {
    subjectName: string;
    subjectCode: string;
  };
  teacher: {
    name: string;
  };
  roomNumber: string;
}

interface ClassOption {
  _id: string;
  className: string;
  section: string;
}

interface AcademicYear {
  _id: string;
  name: string;
  status: "Active" | "Inactive";
}

export default function ClassTimetable() {
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [activeDay, setActiveDay] = useState("Monday");
  const [schedule, setSchedule] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch classes on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // 1. Fetch Academic Years to find the active one
        const yearsRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/academic/years`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const years: AcademicYear[] = await yearsRes.json();
        const activeYear = years.find((y) => y.status === "Active") || years[0];

        if (activeYear) {
          // 2. Fetch Classes for that year
          const classesRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/academic/classes/${activeYear._id}`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          const classesData = await classesRes.json();
          setClasses(classesData);
          if (classesData.length > 0) {
            setSelectedClass(classesData[0]._id);
          }
        }
      } catch {
        toast.error("Failed to load classes");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch schedule when selected class changes
  useEffect(() => {
    if (!selectedClass) return;

    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/timetable/class/${selectedClass}`, {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        const data = await response.json();
        setSchedule(data);
      } catch {
        toast.error("Failed to load timetable");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [selectedClass]);

  const findLesson = (day: string, time: string) => {
    return schedule.find(s => s.day === day && s.startTime === time);
  };

  if (initialLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="size-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageMeta title="Class Timetable | EduSphere" description="View weekly class schedules" />
      <PageBreadcrumb pageTitle="Class Timetable" />

      {/* Header & Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500">
            <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Weekly Schedule
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Class: <span className="font-medium text-brand-500">
                {classes.find(c => c._id === selectedClass)?.className || "None"}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="flex-1 sm:w-auto rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:text-gray-300"
          >
            {classes.map(c => (
              <option key={c._id} value={c._id}>{c.className} {c.section}</option>
            ))}
          </select>
          <button className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 shadow-sm transition-all active:scale-[0.98]">
            Print
          </button>
        </div>
      </div>

      {/* Mobile Day Picker */}
      <div className="lg:hidden flex overflow-x-auto custom-scrollbar gap-2 pb-2">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`whitespace-nowrap rounded-lg px-6 py-2.5 text-sm font-semibold transition-all ${
              activeDay === day
                ? "bg-brand-500 text-white shadow-md font-bold"
                : "bg-white text-gray-500 border border-gray-200 dark:bg-white/5 dark:border-gray-800 dark:text-gray-400"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Mobile View */}
      <div className="lg:hidden space-y-4 relative min-h-[300px]">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-[1px] dark:bg-black/20">
             <div className="size-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
          </div>
        )}
        {timeSlots.map((time) => {
          const lesson = findLesson(activeDay, time);
          const colorClass = lesson ? (subjectColors[lesson.subject.subjectName] || subjectColors.Default) : "";

          return (
            <div key={time} className="flex gap-4 items-start">
              <div className="w-16 pt-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">
                {time.replace(':00', '')}
              </div>
              <div className="flex-1">
                {lesson ? (
                  <div className={`p-4 rounded-2xl border-l-4 shadow-sm ${colorClass}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                        {lesson.subject.subjectName}
                      </span>
                      <span className="text-[10px] font-bold bg-white/50 px-2.5 py-1 rounded-lg dark:bg-black/20">
                        {lesson.roomNumber}
                      </span>
                    </div>
                    <h5 className="font-bold text-gray-900 dark:text-white mb-1">
                      {lesson.teacher.name}
                    </h5>
                    <div className="mt-3 flex items-center gap-3">
                        <p className="text-[11px] opacity-70 flex items-center gap-1.5 font-medium">
                          <svg className="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {time}
                        </p>
                    </div>
                  </div>
                ) : (
                  <div className="h-16 rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-800/10 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-gray-300 dark:text-gray-700 uppercase tracking-widest">Free Slot</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Grid View */}
      <div className="hidden lg:block relative rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-white/[0.03]">
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/50 backdrop-blur-[1px] dark:bg-black/20">
             <div className="size-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
          </div>
        )}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
                <th className="sticky left-0 z-10 w-24 bg-gray-50/80 backdrop-blur-md p-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 dark:bg-gray-900/80">
                  Time
                </th>
                {days.map((day) => (
                  <th key={day} className="min-w-[180px] p-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
              {timeSlots.map((time) => (
                <tr key={time} className="group hover:bg-gray-50/30 dark:hover:bg-white/[0.01] transition-colors">
                  <td className="sticky left-0 z-10 bg-gray-50/80 backdrop-blur-md px-4 py-8 text-center text-[11px] font-bold text-gray-400 dark:bg-gray-900/80">
                    {time}
                  </td>
                  {days.map((day) => {
                    const lesson = findLesson(day, time);
                    const colorClass = lesson ? (subjectColors[lesson.subject.subjectName] || subjectColors.Default) : "";

                    return (
                      <td key={`${day}-${time}`} className="p-2 align-top">
                        {lesson ? (
                          <div
                            className={`rounded-xl border-l-4 p-3 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer ${colorClass}`}
                          >
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                                {lesson.subject.subjectName}
                              </span>
                              <span className="text-sm font-bold truncate tracking-tight text-gray-900 dark:text-white">
                                {lesson.teacher.name}
                              </span>
                              <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium opacity-70">
                                <svg className="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {lesson.roomNumber}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="h-full w-full min-h-[90px] rounded-xl border-2 border-dashed border-gray-50 dark:border-gray-800/10 transition-colors group-hover:bg-gray-50/10" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend / Info */}
      <div className="flex flex-wrap gap-6 py-4 text-[11px] text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800/50">
        <div className="flex items-center gap-2">
          <div className="size-2.5 rounded-full bg-blue-500/50"></div> <span className="font-medium">Science & Math</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-2.5 rounded-full bg-emerald-500/50"></div> <span className="font-medium">Languages</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-2.5 rounded-full bg-rose-500/50"></div> <span className="font-medium">Arts & History</span>
        </div>
        <p className="ml-auto opacity-60 italic">EduSphere Timetable Management v1.0</p>
      </div>
    </div>
  );
}
