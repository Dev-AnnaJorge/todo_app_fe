import { TaskProps } from "@/interfaces";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons/faCheckCircle";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface TaskItemProps {
  task: TaskProps;
  onDelete: (id: number) => void;
  onEdit?: (task: TaskProps) => void;
  onApprove?: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onDelete,
  onEdit,
  onApprove,
}) => {
  const handleEdit = () => {
    onEdit?.(task);
  };

  const handleApprove = (id: number) => {
    onApprove?.(id);
  };

  return (
    <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow mb-4">
      <div className="flex items-center">
        <h3 className="text-lg font-semibold">{task.title}</h3>
        <p className="text-gray-600 ml-2">{task.description}</p>
      </div>
      <div className="flex items-center space-x-2">
        <span className={`font-semibold ${getPriorityColor(task.priority)}`}>
          {task.priority.toUpperCase()}
        </span>
        {onEdit && (
          <button
            onClick={handleEdit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Edit
          </button>
        )}
        <button
          className="text-red-500 px-1 py-2 rounded flex items-center justify-center"
          onClick={() => onDelete(task.id)}
        >
          <FontAwesomeIcon icon={faTrash} className="h-5 w-5" />
        </button>

        {onApprove && (
          <button
            className="text-green-500 px-1 py-2 rounded flex items-center justify-center"
            onClick={() => handleApprove(task.id)}
          >
            <FontAwesomeIcon icon={faCheckCircle} className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

// Helper function to return priority color classes
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "text-red-500"; // High priority
    case "medium":
      return "text-yellow-500"; // Medium priority
    case "low":
      return "text-green-500"; // Low priority
    default:
      return "text-gray-500"; // Default
  }
};

export default TaskItem;
