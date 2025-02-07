"use client";

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

const data = [
  { name: "Monday", completed: 4, incomplete: 2 },
  { name: "Tuesday", completed: 3, incomplete: 5 },
  { name: "Wednesday", completed: 5, incomplete: 3 },
  { name: "Thursday", completed: 7, incomplete: 1 },
  { name: "Friday", completed: 6, incomplete: 2 },
  { name: "Saturday", completed: 6, incomplete: 4 },
  { name: "Sunday", completed: 6, incomplete: 3 },
];

function BarGraph() {
  return (
    <div className="flex bg-transparent shadow-lg rounded-lg w-full gap-4">
      <div className="w-1/2 bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-lg text-[#FEA400] font-semibold mb-4">
          Weekly Tasks Tracker
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <Legend />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="completed" fill="#FEA400" radius={[5, 5, 0, 0]} />
            <Bar dataKey="incomplete" fill="#FF6347" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="w-1/2">
        <CompletedTasks tasksProps={[]} />
      </div>
    </div>
  );
}

export default BarGraph;

// "use client";

// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import CompletedTasks from "../AccomplishedTasks/CompletedTask";
// import axios from "axios";
// import { TaskProps } from "@/interfaces";
// import { useEffect, useState } from "react";

// interface WeeklySummaryProps {
//   task: TaskProps;
// }

// const BarGraph: React.FC<WeeklySummaryProps> = ({ task }) => {
//   const [data, setData] = useState<{
//     name: string;
//     completed: string;
//     incomplete:string;
//   }[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await axios.get(`${process.env.API_URL}/api/todos/getWeeklyTasks`);
//         const transformedData = Object.entries(res.data).map(
//           ([day, values]: any) => ({
//             name: day,
//             completed: values.completed.toString() || "0",
//             incomplete: values.incomplete.toString() || "0"
//           })
//         );
//         setData(transformedData);
//       } catch (error) {
//         console.error("Error fetching weekly tasks:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div className="flex bg-transparent shadow-lg rounded-lg w-full gap-4">
//       <div className="w-1/2 bg-white p-4 rounded-lg shadow-lg">
//         <h2 className="text-lg text-[#FEA400] font-semibold mb-4">
//           Weekly Tasks Tracker
//         </h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={data}>
// <Legend />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Bar dataKey="completed" fill="#FEA400" radius={[5, 5, 0, 0]} />
//             <Bar dataKey="incomplete" fill="#FF6347" radius={[5, 5, 0, 0]} />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//       <div className="w-1/2">
//         <CompletedTasks tasksProps={[]} />
//       </div>
//     </div>
//   );
// };

// export default BarGraph;
