import { CalendarIcon, ChevronDownIcon } from "../../icons";
import { useState, useRef, useEffect } from "react";

interface DateRange {
  label: string;
  value: string;
}

const ranges: DateRange[] = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 Days", value: "last_7" },
  { label: "Last 30 Days", value: "last_30" },
  { label: "Last 90 Days", value: "last_90" },
  { label: "Custom Range", value: "custom" },
];

interface DateRangePickerProps {
  value: string;
  onChange: (val: string) => void;
}

export default function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const currentLabel = ranges.find(r => r.value === value || r.label === value)?.label || "Select Range";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.05]"
      >
        <CalendarIcon className="size-4 text-gray-400" />
        {currentLabel}
        <ChevronDownIcon className={`size-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 origin-top-right rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none dark:border-gray-800 dark:bg-gray-900">
          {ranges.map((range) => (
            <button
              key={range.value}
              onClick={() => {
                onChange(range.value);
                setIsOpen(false);
              }}
              className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                (value === range.value || value === range.label)
                  ? "bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 font-bold"
                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/[0.05]"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
