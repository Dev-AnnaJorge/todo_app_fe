import React, { useEffect, useState } from "react";
import { TaskProps } from "@/interfaces";
import TaskScheduled from "./ToDo/TaskItem";
import TaskUnscheduled from "./ToDo/TaskUnscheduled";
import axios from "axios";

interface TaskListProps {
  tasks: TaskProps[];
  onDelete: (id: number) => void;
  onEdit: (task: TaskProps) => void;
  onApprove: (id: number) => void;
  onSelect: (id: number, status:string) => void;
  onCategoryModal:(id:number, category:string)=>any;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onDelete,
  onApprove,
  onSelect,
  onCategoryModal
}) => {
  const [data, setData] = useState<TaskProps[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.API_URL}/api/todos`);
        setData(res.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchData();
  }, []);

  const handleStatusChange = async (taskId: number, newStatus: string) => {
    try {
      await axios.put(`${process.env.API_URL}/api/todos/${taskId}/status=${newStatus}`, {
        id:taskId,
        status: newStatus,
      });
      
      setData((prevData) =>
        prevData.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
      onSelect?.(taskId, newStatus);
    } catch (error) {
      console.error("Error updating status:", error);
    }
 
  };
   

  return (
    <div>
      <h1 className="text-xl font-semibold">Scheduled</h1>
      <div className="bg-transparent p-4 rounded-lg shadow-md h-52 overflow-y-auto">
        {tasks.filter((task) => task.category === "scheduled").length === 0 ? (
          <p className="text-gray-500">No scheduled tasks available.</p>
        ) : (
         tasks
            .filter((task) => task.category === "scheduled")
            .map((task) => (
              <TaskScheduled
                key={task.id}
                task={task}
                onDelete={onDelete}
                onSelect={
                  handleStatusChange
                }
                onApprove={onApprove}
                onCategoryModal={onCategoryModal}
              />
            ))
        )}
      </div>
      <h1 className="text-xl font-semibold mt-10">Unscheduled</h1>
      <div className="bg-transparent p-4 border-spacing-32 rounded-lg shadow-md h-56 overflow-y-auto">
        {tasks.filter((task) => task.category === "unscheduled").length ===
        0 ? (
          <p className="text-gray-500">No unscheduled tasks available.</p>
        ) : (
          tasks
            .filter((task) => task.category === "unscheduled")
            .map((task) => (
              <TaskUnscheduled
                key={task.id}
                task={task}
                onDelete={onDelete}
                onSelect={
                  handleStatusChange
                }
                onCategoryModal={onCategoryModal}
                onApprove={onApprove}
              />
            ))
        )}
      </div>
    </div>
  );
};

export default TaskList;
