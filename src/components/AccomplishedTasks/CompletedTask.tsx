
import { TaskProps } from "@/interfaces";
import fetchStore from "@/stores/fetchStore"; 
import { observer } from "mobx-react-lite";
import React from "react";
import CompletedSchedule from "./CompletedSchedule";
import CompletedUnSchedule from "./CompletedUnscheduled";

const CompletedTasks: React.FC = observer(() => {
  const completedTasks = fetchStore.completedTasks;

  return (
    <div>
      <h1 className="text-xl font-semibold">Accomplishments</h1>
      <div className="bg-transparent p-4 rounded-lg shadow-md h-52 overflow-y-auto">
        {completedTasks.filter((task: { category: string; }) => task.category === "scheduled").length === 0 ? (
          <p className="text-gray-500">No scheduled tasks available.</p>
        ) : (
          completedTasks
            .filter((task: { category: string; }) => task.category === "scheduled")
            .map((task: TaskProps) => <CompletedSchedule key={task.id} task={task} />)
        )}
      </div>

      {/* Unscheduled Tasks */}
      <h1 className="text-xl font-semibold mt-10">Unscheduled</h1>
      <div className="bg-transparent p-4 rounded-lg shadow-md h-56 overflow-y-auto">
        {completedTasks.filter((task: { category: string; }) => task.category === "unscheduled").length === 0 ? (
          <p className="text-gray-500">No unscheduled tasks available.</p>
        ) : (
          completedTasks
            .filter((task: { category: string; }) => task.category === "unscheduled")
            .map((task: any) => <CompletedUnSchedule key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
});

export default CompletedTasks;
