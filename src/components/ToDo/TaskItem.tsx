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
import RadioButton from "../Buttons/RadioButton";
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

    useEffect(() => {
      setSelectedStatus(task.status);
      setIsStarred(task.important);
      setEffortBurn(task.effortBurn);
    }, [task.status, task.important, task.effortBurn]);

    const toggleStar = async () => {
      try {
        const newImportantValue = !isStarred;
        setIsStarred(newImportantValue);
        await axios.put(
          `${process.env.API_URL}/api/todos/${task.id}/importance=${newImportantValue}`
        );
        fetchStore.updateTaskImportance(task.id, newImportantValue);
        toast.success(newImportantValue ? "Marked as important" : "Unmarked as important");
        fetchStore.fetchTodos();
      } catch (error) {
        console.error("Error updating importance:", error);
        toast.error("Failed to update importance.");
        setIsStarred((prev: any) => !prev); // Revert local state on error
      }
    };
    
    
    

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
      onCategoryModal(task.id, task.category);
      setIsModalOpen(false);
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
        await fetchStore.fetchSummary(date, category);
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
        await fetchStore.fetchCompleted(date, category);
        await fetchStore.fetchSummary(date, category);
        fetchStore.fetchWeeklyTasks(category);
      } catch (error) {
        toast.error("Failed to update task status.");
        console.error("Error updating task status:", error);
      }
      onSelect?.(task.id, completedStatus);
    };

    const handleSaveDescription = async (newDescription: string) => {
      setDescription(newDescription);
      try {
        await axios.put(`${process.env.API_URL}/api/todos/update`, {
          id: task.id,
          title: task.title,
          category: task.category,
          description: newDescription,
        });
        toast.success("Task updated successfully!");
        setIsModalOpen(false);
        fetchStore.editTask({ ...task, description: newDescription }); // Update the MobX store
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
        <div className="flex w-full items-center justify-between">
          <div className="flex w-full items-center justify-between bg-[#F5E8E8] p-4 rounded-full shadow">
            <FontAwesomeIcon
              icon={faStar}
              className={`cursor-pointer transition-colors text-xl ${
                isStarred ? "text-yellow-500" : "text-gray-400"
              }`}
              onClick={toggleStar}
            />
            <div className="flex flex-col w-2/3">
              <h3
                className="text-lg font-semibold cursor-pointer"
                onClick={handleOpenModal}
              >
                {task.title}
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`text-[12px] ${getPriorityColor(task.priority)}`}
              >
                {task.priority.toUpperCase()}
              </span>
            </div>
          </div>
          {/* Action Buttons */}
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
                      selectedStatus === "todo"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={handleApprove}
                    disabled={selectedStatus === "todo"}
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

        {/* Modal */}
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
                  Date: {formatDate(task.createdAt)}
                </h3>
                <RadioButton task={task} />
                <EditableTask task={task} onSave={handleSaveDescription} />
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
