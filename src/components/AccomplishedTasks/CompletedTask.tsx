import { TaskProps } from "@/interfaces";
import fetchStore from "@/stores/fetchStore";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import CompletedSchedule from "./CompletedSchedule";
import CompletedUnSchedule from "./CompletedUnscheduled";

interface CompletedTasksProps {
  scheduled: boolean;
}

const CompletedTasks: React.FC<CompletedTasksProps> = observer(
  ({ scheduled }) => {
    const completedTasks = fetchStore.completedTasks;
    
    useEffect(() => {
      const fetchTasks = async () => {
        const date = new Date().toISOString().split('T')[0]; // Example date
        const category = scheduled ? "scheduled" : "unscheduled";
        await fetchStore.fetchCompleted(date, category);  
      };
      fetchTasks();
    }, []);
    
    const filteredTasks = completedTasks.filter((task: TaskProps) => {
      const isScheduled =
      task.category === (scheduled ? "scheduled" : "unscheduled");
      fetchStore.completedTasks;
      return isScheduled;
    });
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h1 className="text-xl font-semibold">
          {scheduled ? "Scheduled Tasks" : "Unscheduled Tasks"}
        </h1>
        <div className="bg-transparent p-4 rounded-lg h-80 overflow-y-auto">
          {filteredTasks.length === 0 ? (
            <p className="text-gray-500">
              No {scheduled ? "scheduled" : "unscheduled"} tasks available.
            </p>
          ) : (
            filteredTasks.map((task: TaskProps) =>
              scheduled ? (
                <CompletedSchedule key={task.id} task={task} />
              ) : (
                <CompletedUnSchedule key={task.id} task={task} />
              )
            )
          )}
        </div>
      </div>
    );
  }
);

export default CompletedTasks;
