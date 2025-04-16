import * as React from "react";
import Chart from "./Chart";
import { CategoryChartDataInterface } from "@/types/DashboardInterface";

export default function CategoryChart({
  categoryChartData,
}: {
  categoryChartData: CategoryChartDataInterface[];
}) {
  if (!categoryChartData || categoryChartData.length === 0) {
    return <div>No category data available</div>;
  }
  return (
    <div className="barGraph w-2/3 h-full text-center">
      <Chart data={categoryChartData} />
    </div>
  );
}
