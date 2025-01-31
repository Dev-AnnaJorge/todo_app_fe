import { TaskProps } from "@/interfaces";
import {
  faTrashCan,
  faCheckCircle,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import EditableTask from "./Modals/EditableDescription"; // Ensure correct import
import Select from "react-select";
import RadioButton from "./Buttons/Radio";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState(task?.description);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();
 
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleApprove = (id: number) => {
    onApprove?.(id);
  };

  const handleEditDescription = (newDescription: string) => {
    setDescription(newDescription);
    if (onEdit) {
      onEdit({ ...task, description: newDescription });
    }
  };

  const handleStatusChange = async (selectedOption: any) => {
    setSelectedStatus(selectedOption.value);
  };
  const taskStatusOptions = [
    {
      value: "To do",
      label: "To do",
    },
    {
      value: "In Progress",
      label: "In Progress",
    },
  ];
  

  return (
    <div className="flex flex-col w-full">
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
          <button
            className="text-[#990000] px-1 py-2 rounded flex items-center justify-center"
            onClick={() => task.id !== undefined && onDelete(task.id)}
          >
            <FontAwesomeIcon icon={faTrashCan} className="h-5 w-5" />
          </button>
          {onApprove && (
            <button
              className="text-[#38761d] px-1 py-2 rounded flex items-center justify-center"
              onClick={() => handleApprove(task.id!)}
            >
              <FontAwesomeIcon icon={faCheckCircle} className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
      <div className="w-1/4">
        <Select
          id="status"
          options={taskStatusOptions}
          onChange={handleStatusChange}
          value={
            selectedStatus
              ? taskStatusOptions.find(
                  (option) => option.value === selectedStatus
                )
              : null
          }
          isSearchable={false}
          className=" ml-4 text-[12px] outline-none mb-1"
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: "transparent",
              minHeight: "30px",
              padding: "0px",
              boxShadow: "none",
              border: "none",
              color: selectedStatus === "In Progress" ? "blue" : "black",
              ":hover": {
                backgroundColor: "transparent",
              },
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: "white",
            }),
          }}
        />
      </div>

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
