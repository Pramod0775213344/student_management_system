import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { toast } from "react-hot-toast";

// Subject color mapping - consistent with ClassTimetable
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
  classGrade: {
    className: string;
    section: string;
  };
  roomNumber: string;
}

interface TeacherOption {
  _id: string;
  firstName: string;
  lastName: string;
}

export default function TeacherTimetable() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isTeacher = user.role === "teacher";
  const isAdmin = user.role === "admin";

  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [activeDay, setActiveDay] = useState("Monday");
  const [schedule, setSchedule] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch initial data (All teachers for admin, self for teacher)
  useEffect(() => {
    const fetchInitialData = async () => {
      const token = localStorage.getItem("token");
      try {
        if (isAdmin) {
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/teachers`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          const data = await res.json();
          setTeachers(data);
          if (data.length > 0) setSelectedTeacher(data[0]._id);
        } else if (isTeacher && user.teacherId) {
          setSelectedTeacher(user.teacherId);
        }
      } catch {
        toast.error("Failed to load teacher data");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchInitialData();
  }, [isAdmin, isTeacher, user.teacherId]);

  // Fetch schedule based on selected teacher
  useEffect(() => {
    if (!selectedTeacher) return;

    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/timetable/teacher/${selectedTeacher}`, {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        const data = await response.json();
        setSchedule(data);
      } catch {
        toast.error("Failed to load schedule");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [selectedTeacher]);

  const findLesson = (day: string, time: string) => {
    return schedule.find(s => s.day === day && s.startTime === time);
  };

  // Optimized teacher name calculation
  const currentTeacher = isAdmin ? teachers.find(t => t._id === selectedTeacher) : null;
  const currentTeacherName = isAdmin 
    ? (currentTeacher ? `${currentTeacher.firstName} ${currentTeacher.lastName}` : "None")
    : "Your Schedule";

  if (initialLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="size-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageMeta title="Teacher Timetable | EduSphere" description="View teacher-specific weekly schedules" />
      <PageBreadcrumb pageTitle="Teacher Timetable" />

      {/* Header & Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500 shadow-sm">
            <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              {isTeacher ? "My Personal Schedule" : "Teacher Schedule"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isTeacher ? "Viewing your daily classes" : `Viewing: ${currentTeacherName}`}
            </p>
          </div>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-3">
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="w-full sm:w-auto rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:text-gray-300 transition-all font-medium"
            >
              {teachers.map(t => (
                <option key={t._id} value={t._id}>{t.firstName} {t.lastName}</option>
              ))}
            </select>
          </div>
        )}
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
          const session = findLesson(activeDay, time);
          const colorClass = session ? (subjectColors[session.subject.subjectName] || subjectColors.Default) : "";

          return (
            <div key={time} className="flex gap-4 items-start">
              <div className="w-16 pt-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">
                {time.replace(':00', '')}
              </div>
              <div className="flex-1">
                {session ? (
                  <div className={`p-4 rounded-2xl border-l-4 shadow-sm ${colorClass}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                        {session.subject.subjectName}
                      </span>
                      <span className="text-[10px] font-bold bg-white/50 px-2.5 py-1 rounded-lg dark:bg-black/20">
                        {session.roomNumber}
                      </span>
                    </div>
                    <h5 className="font-bold text-gray-900 dark:text-white mb-1 leading-tight">
                      {session.classGrade.className} {session.classGrade.section}
                    </h5>
                    <div className="mt-3 flex items-center justify-between">
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
                    <span className="text-[10px] font-bold text-gray-300 dark:text-gray-700 uppercase tracking-widest">Available</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Timetable Grid (Hidden on mobile) */}
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
                    const session = findLesson(day, time);
                    const colorClass = session ? (subjectColors[session.subject.subjectName] || subjectColors.Default) : "";

                    return (
                      <td key={`${day}-${time}`} className="p-2 align-top">
                        {session ? (
                          <div
                            className={`rounded-xl border-l-4 p-3 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer ${colorClass}`}
                          >
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                                {session.subject.subjectName}
                              </span>
                              <span className="text-sm font-bold truncate tracking-tight text-gray-900 dark:text-white">
                                {session.classGrade.className} {session.classGrade.section}
                              </span>
                              <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium opacity-70">
                                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                {session.roomNumber}
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

      {/* Info Card */}
      <div className="rounded-2xl border border-gray-200 bg-brand-500 p-6 text-white dark:border-gray-800 shadow-lg relative overflow-hidden group">
        <div className="absolute -right-4 -top-4 size-24 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-all duration-500" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-white/20 p-3.5 backdrop-blur-md">
              <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium opacity-80 uppercase tracking-widest">Calculated Load</h4>
              <p className="text-3xl font-black italic tracking-tight">{schedule.length * 2} <span className="text-sm font-normal opacity-60 ml-1">Weekly Units</span></p>
            </div>
          </div>
          <div className="sm:ml-auto w-full sm:w-auto">
            <button className="w-full sm:w-auto rounded-xl bg-white/10 px-6 py-2.5 text-sm font-bold backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all active:scale-[0.98]">
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
