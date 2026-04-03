import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface GradeDistributionProps {
  data: number[];
  categories: string[];
}

export default function GradeDistributionChart({ data, categories }: GradeDistributionProps) {
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
        horizontal: false,
        columnWidth: "45%",
        borderRadius: 8,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: categories, // ["A+", "A", "B+", "B", "C", "F"]
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} Students`,
      },
    },
  };

  const series = [
    {
      name: "Students",
      data: data,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <h4 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
        Grade Distribution
      </h4>
      <Chart options={options} series={series} type="bar" height={320} />
    </div>
  );
}
