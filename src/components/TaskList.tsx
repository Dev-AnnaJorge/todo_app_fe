import React from "react";
import { TaskProps } from "@/interfaces";
import TaskItem from "./TaskItem";

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
  return (
    <div className="bg-transparent p-4 rounded-lg shadow-md h-96 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Scheduled</h2>
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks available.</p>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onDelete={onDelete}
            onApprove={onApprove}
          />
        ))
      )}
    </div>
  );
};

export default TaskList;
