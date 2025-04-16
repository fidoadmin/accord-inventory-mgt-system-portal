import { ProductDetailsInterface } from "@/types/DashboardInterface";
import { useState } from "react";
import Tooltip from "./Tooltip";

interface PieChartProps {
  data: ProductDetailsInterface[];
}
const colors: string[] = [
  "#d0021b",
  "#f5a623",
  "#26a637",
  "#333333",
  "#A52A2A",
];

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false); // New state to track pie chart hover
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  } | null>(null); // Position of the tooltip

  // Calculate total value only if data is present
  const totalValue =
    data && data.length > 0
      ? data.reduce((acc, item) => acc + item.InventoryCount, 0)
      : 0; // Default to 0 if data is empty or undefined

  const handleMouseEnter = (index: number) => {
    setHoveredSlice(index);
    setIsHovered(true); // Set pie chart as hovered
  };

  const handleMouseLeave = () => {
    setHoveredSlice(null);
    setIsHovered(false); // Reset pie chart hover state
    setTooltipPosition(null); // Hide tooltip
  };

  const handleMouseMove = (
    e: React.MouseEvent<SVGPathElement, MouseEvent>,
    idx: number
  ) => {
    const rect = (e.target as SVGPathElement).getBoundingClientRect();
    const x = rect.left + rect.width / 2 + 20;
    const y = rect.top + rect.height / 2;
    setTooltipPosition({ x, y });
    setHoveredSlice(idx);
  };

  const pieSlices = data?.map((item, idx) => {
    const value = item.InventoryCount / totalValue;
    const [startX, startY] = getCoordinatesForPercent(
      data
        .slice(0, idx)
        .reduce((acc, cur) => acc + cur.InventoryCount / totalValue, 0)
    );
    const [endX, endY] = getCoordinatesForPercent(
      data
        .slice(0, idx + 1)
        .reduce((acc, cur) => acc + cur.InventoryCount / totalValue, 0)
    );
    const largeArcFlag = value > 0.5 ? 1 : 0;

    const fillColor =
      isHovered && hoveredSlice !== null && hoveredSlice !== idx
        ? "lightgrey"
        : colors[idx];

    return (
      <path
        key={item.InventoryStatus}
        d={`M16 16 L ${startX * 16 + 16} ${
          startY * 16 + 16
        } A 16 16 0 ${largeArcFlag} 1 ${endX * 16 + 16} ${endY * 16 + 16} Z`}
        fill={fillColor}
        onMouseEnter={() => handleMouseEnter(idx)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={(e) => handleMouseMove(e, idx)}
        style={{ transition: "transform 0.2s" }}
        stroke={
          isHovered && hoveredSlice !== null && hoveredSlice !== idx
            ? colors[idx]
            : ""
        }
        strokeWidth={0.25}
      />
    );
  });

  if (!data || !data.length) {
    return (
      <div className="text-center font-bold w-1/3 h-40">Error Loading Data</div>
    );
  }
  return (
    <div className="flex md:flex-col justify-center items-center w-1/3 p-2 text-center">
      <div
        className="flex md:flex-col justify-center items-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        <svg viewBox="0 0 32 32" className="w-40 h-40">
          {pieSlices}
        </svg>
        {tooltipPosition && (
          <Tooltip
            label={
              hoveredSlice !== null ? data[hoveredSlice].InventoryStatus : ""
            }
            value={
              hoveredSlice !== null ? data[hoveredSlice].InventoryCount : 0
            }
            x={tooltipPosition.x}
            y={tooltipPosition.y}
            visible={hoveredSlice !== null}
          />
        )}
        <ul className="w-fit gap-1">
          {data?.map((item, idx) => (
            <li
              key={item.InventoryStatus}
              className="flex w-fit items-center space-x-1"
            >
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: colors[idx] }}
              ></span>
              <span className="text-text text-xs font-medium text-left">
                {item.InventoryStatus}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

function getCoordinatesForPercent(percent: number): [number, number] {
  const x = Math.cos(2 * Math.PI * percent);
  const y = Math.sin(2 * Math.PI * percent);
  return [x, y];
}

export default PieChart;
