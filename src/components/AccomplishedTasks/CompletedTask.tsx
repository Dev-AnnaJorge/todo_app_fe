import React, { useEffect, useState } from "react";
import { TaskProps } from "@/interfaces";
import TaskScheduled from "../ToDo/TaskItem";
import TaskUnscheduled from "../ToDo/TaskUnscheduled";
import axios from "axios";
import { toast } from "react-toastify";
import CompletedSchedule from "./CompletedSchedule";

interface CompletedTasksProps {
  tasksProps: TaskProps[];
  onDelete: (id: number) => void;
}

const CompletedTasks: React.FC<CompletedTasksProps> = ({
  tasksProps,
  onDelete,
}) => {
  const [completedTasks, setCompletedTasks] = useState<TaskProps[]>([]);

  const fetchCompletedTasks = async () => {
    try {
      const res = await axios.get(`${process.env.API_URL}/api/todos/completed`);
      setCompletedTasks(res.data);
    } catch (error) {
      toast.error("Failed to fetch completed tasks.");
      console.error("Error fetching completed tasks:", error);
    }
  };

  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  return (
    <div>
      {/* Scheduled Tasks */}
      <h1 className="text-xl font-semibold">Accomplishments</h1>
      <div className="bg-transparent p-4 rounded-lg shadow-md h-52 overflow-y-auto">
        {completedTasks.filter((task) => task.category === "scheduled").length === 0 ? (
          <p className="text-gray-500">No scheduled tasks available.</p>
        ) : (
          completedTasks
            .filter((task) => task.category === "scheduled")
            .map((task) => <CompletedSchedule key={task.id} task={task} />)
        )}
      </div>

      {/* Unscheduled Tasks
      <h1 className="text-xl font-semibold mt-10">Unscheduled</h1>
      <div className="bg-transparent p-4 border-spacing-32 rounded-lg shadow-md h-56 overflow-y-auto">
        {completedTasks.filter((task) => task.category === "unscheduled").length === 0 ? (
          <p className="text-gray-500">No unscheduled tasks available.</p>
        ) : (
          completedTasks
            .filter((task) => task.category === "unscheduled")
            .map((task) => <CompletedSchedule key={task.id} task={task} />)
        )}
      </div> */}
    </div>
  );
};

export default CompletedTasks;
