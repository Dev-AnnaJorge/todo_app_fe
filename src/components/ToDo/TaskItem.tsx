import { TaskProps } from "@/interfaces";
import {
  faTrashCan,
  faCheckCircle,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import EditableTask from "../Modals/EditableDescription";
import Select from "react-select";
import RadioButton from "../Buttons/Radio";
import axios from "axios";
import { toast } from "react-toastify";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

interface TaskScheduledProps {
  task: TaskProps;
  onDelete: (id: number) => void;
  onEdit?: (task: TaskProps) => void;
  onApprove?: (id: number) => void;
  onSelect?: (id: number, status: string) => any;
}

const TaskItem: React.FC<TaskScheduledProps> = ({
  task,
  onDelete,
  onEdit,
  onApprove,
  onSelect,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState(task?.description);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    task.status
  );

  useEffect(() => {
    setSelectedStatus(task.status);
  }, [task.status]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSelect = async (selectedOption: any) => {
    const newStatus = selectedOption.value;
    setSelectedStatus(newStatus);

    try {
      await axios.put(
        `${process.env.API_URL}/api/todos/${task.id}/status=${task.status}`,
        {
          id: task.id,
          status: newStatus,
        }
      );
      toast.success("Task status updated successfully!");
    } catch (error) {
      toast.error("Failed to update status.");
      console.error("Error updating status:", error);
    }

    onSelect?.(task.id, newStatus);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${process.env.API_URL}/api/todos/${id}`);
      toast.success("Task deleted successfully!");
      onDelete(id);
      window.location.reload();
    } catch (error) {
      toast.error("Failed to delete task.");
      console.error("Error deleting task:", error);
    }
  };

  const handleEditDescription = (newDescription: string) => {
    setDescription(newDescription);
    if (onEdit) {
      onEdit({ ...task, description: newDescription });
    }
  };

  const CompletedIcon = () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
        color: "green",
      }}
    >
      <ThumbUpIcon />
    </div>
  );
  const taskStatusOptions = [
    { value: "todo", label: "To do" },
    { value: "in_progress", label: "In Progress" },
  ];

  return (
    <div className="flex flex-col w-full border-2 p-2 rounded-lg mt-2">
      <div className="flex w-full items-center justify-between">
        <div className="flex w-full items-center justify-between bg-[#F5E8E8] p-4 rounded-full shadow">
          <div className="flex flex-col w-2/3">
            <h3
              className="text-lg font-semibold cursor-pointer"
              onClick={handleOpenModal}
            >
              {task.title}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-[12px] ${getPriorityColor(task.priority)}`}>
              {task.priority.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="flex m-2 gap-2">
          {selectedStatus === "completed" ? (
            <CompletedIcon />
          ) : (
            <>
              <button
                className="text-[#990000] px-1 py-2 rounded flex items-center justify-center"
                onClick={() => task.id !== undefined && handleDelete(task.id)}
              >
                <FontAwesomeIcon icon={faTrashCan} className="h-5 w-5" />
              </button>
              {onApprove && (
                <button
                  className={`text-[#38761d] px-1 py-2 rounded flex items-center justify-center ${
                    selectedStatus === "completed"
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={() =>
                    selectedStatus !== "completed" && onApprove(task.id)
                  }
                  disabled={selectedStatus === "completed"}
                >
                  <FontAwesomeIcon icon={faCheckCircle} className="h-5 w-5" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Status Dropdown */}
      {selectedStatus !== "completed" && (
        <div className="w-1/2">
          <Select
            id="status"
            options={taskStatusOptions}
            onChange={handleSelect}
            value={taskStatusOptions.find(
              (option) => option.value === selectedStatus
            )}
            isSearchable={false}
            className="ml-4 text-[12px] outline-none mb-1 w-40"
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "transparent",
                minHeight: "30px",
                padding: "0px",
                boxShadow: "none",
                border: "none",
                color: selectedStatus === "in_progress" ? "blue" : "black",
                ":hover": { backgroundColor: "transparent" },
              }),
              menu: (base) => ({ ...base, backgroundColor: "white" }),
            }}
          />
        </div>
      )}
      {/* Modal for Editing Task */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center h-full">
          <div className="bg-[#EBEBEB] p-6 rounded-lg shadow-lg w-96 relative flex flex-col">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-black rounded-full hover:bg-gray-300 transition"
            >
              <FontAwesomeIcon icon={faCircleXmark} className="w-5" />
            </button>
            <div className="m-2">
              <h2 className="text-[20px] font-bold text-center">
                {task.title}
              </h2>
              <h3 className="text-gray-600 text-[12px] text-center m-1 font-semibold">
                Date:
              </h3>
              <RadioButton />
              <EditableTask
                description={description}
                onSave={handleEditDescription}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Function to determine priority color
const getPriorityColor = (priority: string) => {
  switch (priority.toUpperCase()) {
    case "HIGH":
      return "text-red-500";
    case "MEDIUM":
      return "text-yellow-500";
    case "LOW":
      return "text-blue-500";
    default:
      return "text-gray-500";
  }
};

export default TaskItem;
