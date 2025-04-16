"use client";
import React, { useState, useEffect, useRef } from "react";
import { scaleLinear, scaleBand } from "d3-scale";
import { max } from "d3-array";
import { select, axisBottom, axisLeft } from "d3";
import { CategoryChartDataInterface } from "@/types/DashboardInterface";

type ChartProps = {
  data: CategoryChartDataInterface[];
};

const Chart: React.FC<ChartProps> = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const xAxisRef = useRef<SVGGElement>(null);
  const yAxisRef = useRef<SVGGElement>(null);

  const width = 400;
  const height = 250;
  const margin = { top: 20, right: 30, bottom: 60, left: 60 };

  // Find max value from the data
  const dataMax = max(data, (d) => d.CategoryNameCount) as number;

  // Calculate the maximum y-axis value based on your rules
  let yMax;
  if (dataMax < 10) {
    yMax = Math.ceil(dataMax / 5) * 5; // Round up to nearest 5
  } else if (dataMax < 100) {
    yMax = Math.ceil(dataMax / 10) * 10; // Round up to nearest 10
  } else if (dataMax < 1000) {
    yMax = Math.ceil(dataMax / 100) * 100; // Round up to nearest 100
  } else {
    yMax = Math.ceil(dataMax / 1000) * 1000; // Round up to nearest 1000
  }

  // Set up scales for x and y axes
  const x = scaleBand()
    .domain(data.map((d) => d.CategoryName))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  const y = scaleLinear()
    .domain([0, yMax]) // Set max value for y-axis dynamically
    .range([height - margin.bottom, margin.top]); // Adjusted range to account for space

  // Mouse events for tooltips
  const handleMouseEnter = (index: number) => setHoveredIndex(index);

  const handleMouseMove = (
    e: React.MouseEvent<SVGRectElement, MouseEvent>,
    idx: number
  ) => {
    // Get mouse position relative to the SVG
    const svg = svgRef.current;
    if (svg) {
      const point = svg.createSVGPoint();
      point.x = e.clientX;
      point.y = e.clientY;

      // Update tooltip position and data
    }
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  // Use D3 to create axes
  useEffect(() => {
    if (xAxisRef.current && yAxisRef.current) {
      const svg = select(svgRef.current);

      // Append x-axis
      const xAxis = select(xAxisRef.current).call(axisBottom(x));
      const yAxis = select(yAxisRef.current).call(axisLeft(y));

      // Rotate and reduce font size for x-axis labels (categories)
      xAxis
        .selectAll("text")
        .attr("transform", "rotate(45)")
        .style("text-anchor", "start")
        .style("font-size", "10px") // Set smaller font size for x-axis
        .attr("dx", "0.5em")
        .attr("dy", "-0.5em");

      // Append y-axis

      // Reduce font size for y-axis labels (values)
      yAxis.selectAll("text").style("font-size", "10px"); // Set smaller font size for y-axis

      // Append x-axis label
      svg
        .select(".x-axis-label")
        .attr("transform", `translate(${width / 2}, ${height - 10})`)
        .style("text-anchor", "middle")
        .style("fill", "currentColor")
        .style("font-size", "12px")
        .text("Categories");

      // Append y-axis label
      svg
        .select(".y-axis-label")
        .attr(
          "transform",
          `translate(${margin.left - 30}, ${height / 2}) rotate(-90)`
        )
        .style("text-anchor", "middle")
        .style("fill", "currentColor")
        .style("font-size", "12px")
        .text("Values");
    }
  }, [x, y, data.length, margin.left]);

  if (!data || !data.length) {
    return (
      <div className="text-center font-bold"> Category data not found</div>
    );
  }

  return (
    <div className="relative w-full h-full max-w-3xl mx-auto">
      <div className="w-full h-full lg:absolute">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="top-0 left-0 w-full h-full my-auto"
        >
          <g className="bars">
            {data.map((item, idx) => (
              <rect
                key={idx}
                x={x(item.CategoryName)}
                y={y(item.CategoryNameCount)}
                width={x.bandwidth()}
                height={y(0) - y(item.CategoryNameCount)}
                fill={
                  hoveredIndex === idx
                    ? "orange"
                    : item.CategoryNameCount > 40
                    ? "#26a637"
                    : "#d0021b"
                }
                onMouseEnter={() => handleMouseEnter(idx)}
                onMouseMove={(e) => handleMouseMove(e, idx)}
                onMouseLeave={handleMouseLeave}
                style={{ transition: "fill 0.2s" }}
              />
            ))}
          </g>
          {/* Tooltip Rendering */}
          {hoveredIndex !== null && hoveredIndex !== undefined && (
            <g>
              <rect
                x={x(data[hoveredIndex].CategoryName)! + x.bandwidth() / 2 - 50}
                y={y(data[hoveredIndex].CategoryNameCount) - 25}
                width={100}
                height={20}
                fill="#181818"
                stroke="#2279dd"
                rx={8}
                className="z-50"
              />
              <text
                x={x(data[hoveredIndex].CategoryName)! + x.bandwidth() / 2}
                y={y(data[hoveredIndex].CategoryNameCount) - 10}
                textAnchor="middle"
                fill="white"
                fontSize="12px"
              >
                {`${data[hoveredIndex].CategoryName}: ${data[hoveredIndex].CategoryNameCount}`}
              </text>
            </g>
          )}

          {/* X-axis */}
          <g
            ref={xAxisRef}
            transform={`translate(0,${height - margin.bottom})`}
          />
          <text className="x-axis-label" />

          {/* Y-axis */}
          <g ref={yAxisRef} transform={`translate(${margin.left}, 0)`} />
        </svg>
      </div>
    </div>
  );
};

export default Chart;
