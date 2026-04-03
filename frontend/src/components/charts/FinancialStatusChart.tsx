import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface FinancialStatusProps {
  data: number[]; // e.g. [65, 25, 10]
  labels: string[]; // e.g. ["Paid", "Pending", "Overdue"]
}

export default function FinancialStatusChart({ data, labels }: FinancialStatusProps) {
  const options: ApexOptions = {
    colors: ["#039855", "#fdb022", "#d92d20"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "donut",
      height: 380,
    },
    labels: labels,
    legend: {
      show: true,
      position: "bottom",
      fontFamily: "Outfit",
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${Math.round(val)}%`,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "75%",
          labels: {
            show: true,
            name: {
              show: true,
            },
            value: {
              show: true,
              fontSize: "24px",
              fontWeight: "700",
              formatter: (val: string) => `${val}%`,
            },
            total: {
              show: true,
              label: "Collection",
              formatter: () => "86%",
            },
          },
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}% of Total Revenue`,
      },
    },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <h4 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
        Fee Collection Status
      </h4>
      <Chart options={options} series={data} type="donut" height={380} />
    </div>
  );
}
