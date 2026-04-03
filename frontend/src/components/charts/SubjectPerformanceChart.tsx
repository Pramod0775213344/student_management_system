import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface SubjectPerformanceProps {
  data: number[];
  categories: string[];
}

export default function SubjectPerformanceChart({ data, categories }: SubjectPerformanceProps) {
  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 320,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "60%",
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val}%`,
      offsetX: -10,
      style: {
        fontSize: "12px",
        colors: ["#fff"],
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "horizontal",
        shadeIntensity: 0.25,
        gradientToColors: ["#9ba9ff"],
        inverseColors: true,
        opacityFrom: 0.85,
        opacityTo: 0.85,
        stops: [50, 0, 100],
      },
    },
    xaxis: {
      categories: categories,
      labels: {
        formatter: (val: string) => `${val}%`,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (val: number) => `${val}% Average Score`,
      },
    },
  };

  const series = [
    {
      name: "Average Score",
      data: data,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <h4 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
        Subject-wise Performance
      </h4>
      <Chart options={options} series={series} type="bar" height={320} />
    </div>
  );
}
