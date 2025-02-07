"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CompletedTasks from "../AccomplishedTasks/CompletedTask";

const data = [
  { name: "Monday", sales: 4000 },
  { name: "Tuesday", sales: 3000 },
  { name: "Wednesday", sales: 5000 },
  { name: "Thursday", sales: 7000 },
  { name: "Friday", sales: 6000 },
  { name: "Saturday", sales: 6000 },
  { name: "Sunday", sales: 6000 },
];

export default function BarGraph() {
  return (
    <div className="flex  bg-transparent shadow-lg rounded-lg w-full gap-4">
      <div className="w-1/2 bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-lg text-[#FEA400] font-semibold mb-4">
          Weekly Tasks Tracker
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#FEA400" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="w-1/2">
        <CompletedTasks
          tasksProps={[]}
          onDelete={function (id: number): void {
            throw new Error("Function not implemented.");
          }}
        />
      </div>
    </div>
  );
}
