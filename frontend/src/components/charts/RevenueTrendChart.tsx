import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface RevenueTrendProps {
  data: number[];
  categories: string[];
}

export default function RevenueTrendChart({ data, categories }: RevenueTrendProps) {
  const options: ApexOptions = {
    colors: ["#039855"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "line",
      height: 380,
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: 4,
    },
    dataLabels: {
      enabled: false,
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
      labels: {
        formatter: (val: number) => `Rs. ${val.toLocaleString()}`,
      },
    },
    grid: {
      borderColor: "#f1f1f1",
      strokeDashArray: 5,
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (val: number) => `Rs. ${val.toLocaleString()}`,
      },
    },
  };

  const series = [
    {
      name: "Revenue",
      data: data,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <h4 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
        Monthly Revenue Trend
      </h4>
      <Chart options={options} series={series} type="line" height={380} />
    </div>
  );
}
