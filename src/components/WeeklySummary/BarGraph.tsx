"use client";

import { useCallback, useEffect } from "react";
import { observer } from "mobx-react-lite";
import fetchStore from "@/stores/fetchStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import CompletedTasks from "../AccomplishedTasks/CompletedTask";

interface BarGraphProps {
  scheduled: boolean;
}

const BarGraph: React.FC<BarGraphProps> = observer(({ scheduled }) => {
  useEffect(() => {
    const category = scheduled ? "scheduled" : "unscheduled";
    fetchStore.fetchWeeklyTasks(category);
  }, [scheduled]);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  function getDateForDay(dayIndex: number): string {
    const currentDate = new Date();
    const currentDayIndex = currentDate.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
    const mondayDate = new Date(currentDate);
    mondayDate.setDate(currentDate.getDate() - ((currentDayIndex + 6) % 7)); // Correct Monday calculation
    const dayDate = new Date(mondayDate);
    dayDate.setDate(mondayDate.getDate() + dayIndex);
    return dayDate.toISOString().split("T")[0];
  }

  const todayDate = new Date().toISOString().split("T")[0];
  const weeklyTasks = fetchStore.weeklyTasks;
  const chartData = daysOfWeek.map((day, index) => {
    const taskData = (weeklyTasks[day] as {
      date: string;
      complete: string | number;
      incomplete: string | number;
    }) || { date: null, complete: 0, incomplete: 0 };
    const date = getDateForDay(index);

    return {
      name: day,
      date: date,
      completed: taskData.complete ? Number(taskData.complete) : 0,
      incomplete: taskData.incomplete ? Number(taskData.incomplete) : 0,
    };
  });
  chartData.forEach((data) => {});

  const renderCustomTick = (tickProps: any) => {
    const { x, y, payload } = tickProps;
    const { value } = payload;
    const item = chartData.find((d) => d.name === value);
    if (!item) return <g />;

    const isToday = item.date === todayDate; // Check if the date is today

    return (
      <g transform={`translate(${x},${y + 10})`}>
        <text
          x={0}
          y={0}
          textAnchor="middle"
          fill="#666"
          fontSize="12px"
          fontWeight="bold"
        >
          {item.name}
        </text>
        <text
          x={0}
          y={15}
          textAnchor="middle"
          fill={isToday ? "#666" : "#999"}
          fontSize="11px"
          fontWeight={isToday ? "bold" : "normal"}
        >
          {item.date}
        </text>
      </g>
    );
  };

  return (
    <div className="flex bg-transparent shadow-lg rounded-lg w-full gap-4">
      {/* Bar Chart */}
      <div className="w-1/2 bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-lg text-[#FEA400] font-semibold mb-4">
          Weekly Tasks Tracker ({scheduled ? "Scheduled" : "Unscheduled"})
        </h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} barCategoryGap="20%">
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ padding: "16px", fontSize: "14px" }}
              />
              <XAxis dataKey="name" tick={renderCustomTick} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completed" fill="#FEA400" radius={[5, 5, 0, 0]} />
              <Bar dataKey="incomplete" fill="#FF6347" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500">Loading tasks...</p>
        )}
      </div>

      {/* Completed Tasks */}
      <div className="w-1/2">
        <CompletedTasks scheduled={scheduled} />
      </div>
    </div>
  );
});

export default BarGraph;
