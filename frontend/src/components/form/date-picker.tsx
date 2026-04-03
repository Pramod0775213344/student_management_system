import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "./Label";
import { CalendarIcon } from "../../icons";
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: Hook | Hook[];
  defaultDate?: DateOption;
  label?: string;
  placeholder?: string;
  error?: boolean;
  hint?: string;
};

export default function DatePicker({
  id,
  mode,
  onChange,
  label,
  defaultDate,
  placeholder,
  error = false,
  hint = "",
}: PropsType) {
  const flatpickrInstance = useRef<flatpickr.Instance | null>(null);

  useEffect(() => {
    // Initial initialization
    const fp = flatpickr(`#${id}`, {
      mode: mode || "single",
      static: true,
      monthSelectorType: "static",
      dateFormat: "Y-m-d",
      defaultDate,
      onChange,
    });

    if (Array.isArray(fp)) {
      flatpickrInstance.current = fp[0];
    } else {
      flatpickrInstance.current = fp;
    }

    return () => {
      if (flatpickrInstance.current) {
        flatpickrInstance.current.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, mode]); // onChange me dependancy array ekata danna epa loop wenna puluwan nisa

  // Prop eka change weddi flatpickr eka sync karanawa loop wenne nathi wenna
  useEffect(() => {
    if (flatpickrInstance.current) {
      const currentVal = flatpickrInstance.current.input.value;
      const newVal = defaultDate ? (typeof defaultDate === "string" ? defaultDate : "") : "";
      
      if (currentVal !== newVal) {
        if (!newVal) {
          flatpickrInstance.current.clear();
        } else {
          // false flag eka nisa onChange function eka ayeth call wenne na loop eka nawathinawa
          flatpickrInstance.current.setDate(newVal, false);
        }
      }
    }
  }, [defaultDate]);

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        <input
          id={id}
          readOnly
          placeholder={placeholder}
          className={`h-11 w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 ${
            error
              ? "border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:border-error-500 dark:focus:border-error-800"
              : "bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800"
          }`}
        />

        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <CalendarIcon className="size-6" />
        </span>
      </div>

      {hint && (
        <p className={`mt-1.5 text-xs ${error ? "text-error-500" : "text-gray-500"}`}>
          {hint}
        </p>
      )}
    </div>
  );
}
