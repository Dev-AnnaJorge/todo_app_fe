import React from "react";
import { TaskProps } from "@/interfaces";
import TaskScheduled from "./TaskItem"; // Assuming TaskScheduled exists
import TaskUnscheduled from "./TaskUnscheduled"; // Assuming TaskUnscheduled exists

interface TaskListProps {
  tasks: TaskProps[];
  onDelete: (id: number) => void;
  onEdit: (task: TaskProps) => void;
  onApprove: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onDelete,
  onEdit,
  onApprove,
}) => {
  // Separate tasks into scheduled and unscheduled
  const scheduledTasks = tasks.filter((task) => task.category);
  const unscheduledTasks = tasks.filter((task) => !task.category);

  return (
    <div className="">
      <h1 className="text-xl font-semibold">Scheduled</h1>
      <div className="bg-transparent p-4 rounded-lg shadow-md h-52 overflow-y-auto scrollable">
        {scheduledTasks.length === 0 ? (
          <p className="text-gray-500">No scheduled tasks available.</p>
        ) : (
          scheduledTasks.map((task) => (
            <TaskScheduled
              key={task.id}
              task={task}
              onDelete={onDelete}
              onApprove={onApprove}
            />
          ))
        )}
      </div>
      <h1 className="text-xl font-semibold mt-10">Unscheduled</h1>
      <div className="bg-transparent p-4 border-spacing-32 rounded-lg shadow-md h-56 overflow-y-auto scrollable">
        {unscheduledTasks.length === 0 ? (
          <p className="text-gray-500">No unscheduled tasks available.</p>
        ) : (
          unscheduledTasks.map((task) => (
            <TaskUnscheduled
              key={task.id}
              task={task}
              onDelete={onDelete}
              onApprove={onApprove}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;
