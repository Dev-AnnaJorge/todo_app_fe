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

  const weeklyTasks = fetchStore.weeklyTasks;
  const chartData = Object.entries(weeklyTasks).map(([day, data]) => {
    const taskData = data as {
      complete: string | number;
      incomplete: string | number;
    };
    return {
      name: day,
      completed: Number(taskData.complete),
      incomplete: Number(taskData.incomplete),
    };
  });
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
              <Legend />
              <XAxis dataKey="name" />
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
