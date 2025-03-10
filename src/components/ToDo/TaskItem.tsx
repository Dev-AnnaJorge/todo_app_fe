import { TaskProps } from "@/interfaces";
import {
  faTrashCan,
  faCheckCircle,
  faCircleXmark,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import EditableTask from "../Modals/EditableDescription";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-hot-toast";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { observer } from "mobx-react-lite";
import fetchStore from "@/stores/fetchStore";

interface TaskScheduledProps {
  task: TaskProps;
  onApprove?: (id: number) => void;
  onSelect?: (id: number, status: string) => any;
  onCategoryModal: (id: number, category: string) => any;
}

const TaskItem: React.FC<TaskScheduledProps> = observer(
  ({ task, onApprove, onSelect, onCategoryModal }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [description, setDescription] = useState(task?.description);
    const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
      task.status
    );
    const [isStarred, setIsStarred] = useState(task.important);
    const [effortBurn, setEffortBurn] = useState(task?.effortBurn);
    const [taskState, setTaskState] = useState<TaskProps>(task);

    useEffect(() => {
      if (isModalOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    }, [isModalOpen]);

    useEffect(() => {
      setSelectedStatus(task.status);
      setIsStarred(task.important);
      setEffortBurn(task.effortBurn);
    }, [task.status, task.important, task.effortBurn]);

    const toggleStar = async () => {
      try {
        const newImportantValue = !isStarred;
        setIsStarred(newImportantValue);

        if (newImportantValue) {
          localStorage.setItem(`task-${task.id}-starred`, "true");
        } else {
          localStorage.removeItem(`task-${task.id}-starred`);
        }
        await axios.put(
          `${process.env.API_URL}/api/todos/${task.id}/importance=${newImportantValue}`
        );

        fetchStore.updateTaskImportance(task.id, newImportantValue);
        toast.success(
          newImportantValue ? "Marked as important" : "Unmarked as important"
        );
      } catch (error) {
        console.error("Error updating importance:", error);
        toast.error("Failed to update importance.");
        setIsStarred((prev: any) => !prev);
      }
    };

    useEffect(() => {
      const starred =
        localStorage.getItem(`task-${task.id}-starred`) === "true";
      setIsStarred(starred);
    }, [task.id]);

    const handleOpenModal = () => setIsModalOpen(true);

    const handleCloseModal = () => {
      onCategoryModal(task.id, task.category);
      setIsModalOpen(false);
    };

    const handleCategoryChange = async (newCategory: string) => {
      const updatedTask = {
        ...taskState,
        category: newCategory,
      };
      setTaskState(updatedTask); // Update local state
    };

    const handleSelect = async (selectedOption: any) => {
      const newStatus = selectedOption.value;
      setSelectedStatus(newStatus);
      try {
        await axios.put(
          `${process.env.API_URL}/api/todos/${task.id}/status=${newStatus}`
        );
        toast.success("Task status updated successfully!");
        const date = new Date().toISOString().split("T")[0];
        const category = task.category;
        if (fetchStore.user) {
          await fetchStore.fetchSummary(fetchStore.user.userId);
        }
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
        fetchStore.deleteTask(id);
      } catch (error) {
        toast.error("Failed to delete task.");
        console.error("Error deleting task:", error);
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

    const handleApprove = async () => {
      const completedStatus = "completed";
      const completedDate = new Date().toISOString();
      setSelectedStatus(completedStatus);
      setEffortBurn(effortBurn);

      try {
        await axios.put(
          `${process.env.API_URL}/api/todos/${task.id}/status=${completedStatus}`,
          {}
        );
        toast.success("Task marked as completed!");
        fetchStore.approveTask(task.id, completedDate);
        const date = new Date().toISOString().split("T")[0];
        const category = task.category;
        if (fetchStore.user) {
          await fetchStore.fetchCompletedToday(fetchStore.user.userId);
          await fetchStore.fetchSummary(fetchStore.user.userId);
          await fetchStore.fetchTodos(fetchStore.user.userId);
        }
        // fetchStore.fetchWeeklyTasks(category);
      } catch (error) {
        toast.error("Failed to update task status.");
        console.error("Error updating task status:", error);
      }
      onSelect?.(task.id, completedStatus);
    };

    const handleSaveDescription = async (
      newDescription: string,
      newCategory: string
    ) => {
      handleCategoryChange(newCategory);
      setDescription(newDescription);
      try {
        await axios.put(`${process.env.API_URL}/api/todos/update`, {
          id: task.id,
          title: task.title,
          category: newCategory, // Use the updated category
          description: newDescription,
        });
        toast.success("Task updated successfully!");
        fetchStore.editTask({
          ...task,
          description: newDescription,
          category: newCategory, // Use the updated category
        });
        setTaskState((prev) => ({
          ...prev,
          description: newDescription,
          category: newCategory,
        }));
      } catch (error) {
        toast.error("Failed to update task.");
        console.error("Error updating task:", error);
      }
    };

    const formatDate = (dateString: string | undefined) => {
      if (!dateString) return "No Date Provided";
      const dateObj = new Date(dateString);
      if (isNaN(dateObj.getTime())) {
        return "Invalid Date";
      }
      return dateObj.toLocaleDateString();
    };

    const taskStatusOptions = [
      { value: "todo", label: "To do" },
      { value: "in_progress", label: "In Progress" },
    ];

    return (
      <div className="flex flex-col w-full border-2 p-2 rounded-lg mt-2">
        {/* Task Header */}
        <div className="flex flex-wrap md:flex-nowrap w-full items-center justify-between gap-2">
          {/* Star Icon */}
          <FontAwesomeIcon
            icon={faStar}
            className={`cursor-pointer transition-colors text-xl h-4.5 w-4.5 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5 ${
              isStarred ? "text-yellow-500" : "text-gray-400"
            }`}
            onClick={toggleStar}
          />
          {/* Task Title & Info */}
          <div className="flex flex-col sm:flex-row w-full items-center justify-between bg-[#F5E8E8] p-4 rounded-lg shadow gap-2">
            <h3
              className="text-sm sm:text-sm md:text-lg font-normal text-[#4D4C4C] cursor-pointer w-full sm:w-2/3 text-center sm:text-left"
              onClick={handleOpenModal}
            >
              {task.title}
            </h3>
            <div className="flex items-center justify-center sm:justify-end space-x-2 w-full sm:w-auto">
              {/* Category */}
              <span className="text-[12px] sm:text-sm md:text-[12px] text-gray-600">
                {task.category.toUpperCase()}
              </span>

              {/* Priority */}
              <span
                className={`text-[12px] sm:text-sm md:text-[12px] ${getPriorityColor(
                  task.priority
                )}`}
              >
                {task.priority.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex flex-row items-center justify-end gap-2 w-full sm:w-auto md:w-1/4">
            {/* Status Selector */}
            <div className="w-1/2 sm:w-auto flex justify-end ">
              {selectedStatus !== "completed" && (
                <Select
                  id="status"
                  options={taskStatusOptions}
                  onChange={handleSelect}
                  value={taskStatusOptions.find(
                    (option) => option.value === selectedStatus
                  )}
                  isSearchable={false}
                  className="text-[12px] outline-none w-full sm:w-40"
                  menuPortalTarget={document.body}
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: "transparent",
                      minHeight: "30px",
                      padding: "0px",
                      boxShadow: "none",
                      border: "none",
                    }),
                    menuPortal: (base) => ({ ...base, zIndex: 9998 }),
                    menu: (base) => ({ ...base, backgroundColor: "white" }),
                  }}
                />
              )}
            </div>
            {/* Action Buttons */}
            <div className="flex gap-2 w-1/2 sm:w-auto justify-end mt-2 sm:mt-0">
              {selectedStatus === "completed" ? (
                <CompletedIcon />
              ) : (
                <>
                  <button
                    className="text-[#990000] px-1 py-2 rounded flex items-center justify-center "
                    onClick={() =>
                      task.id !== undefined && handleDelete(task.id)
                    }
                  >
                    <FontAwesomeIcon icon={faTrashCan} className="h-4 w-4 sm:h-4 sm:w-4 md:h-5 md:w-5"/>
                  </button>
                  {onApprove && (
                    <button
                      className={`text-[#38761d] px-1 py-2 rounded flex items-center justify-center ${
                        selectedStatus === "todo"
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={handleApprove}
                      disabled={selectedStatus === "todo"}
                    >
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="h-4 w-4 sm:h-4 sm:w-4 md:h-5 md:w-5"
                      />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center h-full z-[9999]">
            <div className="bg-[#EBEBEB] p-6 rounded-lg shadow-lg w-[90%] sm:w-96 relative flex flex-col">
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
                  Date: {formatDate(task.createdAt)}
                </h3>
                <EditableTask
                  task={task}
                  onSave={handleSaveDescription}
                  onClose={() => setIsModalOpen(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);
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
