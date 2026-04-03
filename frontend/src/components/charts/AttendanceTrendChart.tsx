import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface AttendanceTrendProps {
  data: number[];
  categories: string[];
}

export default function AttendanceTrendChart({ data, categories }: AttendanceTrendProps) {
  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "area",
      height: 320,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 100],
      },
    },
    xaxis: {
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: {
        formatter: (val: number) => `${val}%`,
      },
    },
    grid: {
      borderColor: "#f1f1f1",
      strokeDashArray: 5,
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (val: number) => `${val}% Presence`,
      },
    },
  };

  const series = [
    {
      name: "Attendance Rate",
      data: data,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <h4 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
        Attendance Trend (Last 7 Days)
      </h4>
      <Chart options={options} series={series} type="area" height={320} />
    </div>
  );
}
