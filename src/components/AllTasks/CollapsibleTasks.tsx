import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite"; // ✅ Ensure observer is properly imported
import { Hourglass, Notebook } from "lucide-react";
import TaskBoard from "./TaskBoard";
import { TaskProps } from "@/interfaces";
import toast from "react-hot-toast";
import fetchStore from "@/stores/fetchStore";

interface CollapsibleTasksProps {
  tasks: { [date: string]: TaskProps[] };
}

const CollapsibleTasks = ({ tasks }: CollapsibleTasksProps) => {
  const [isTaskCollapsed, setIsTaskCollapsed] = useState(false);
  const [expandedDates, setExpandedDates] = useState<string[]>([]);

  const toggleTaskSection = () => {
    setIsTaskCollapsed(!isTaskCollapsed);
  };

  const toggleDate = (date: string) => {
    setExpandedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };
  useEffect(() => {
    const fetchData = async () => {
      if (fetchStore.user) {
        await fetchStore.fetchTodosToday(fetchStore.user.userId);
        await fetchStore.fetchTodos(fetchStore.user.userId);
      }
    };
    fetchData();
  }, []);

  const handleStatusChange = async (Id: number, newStatus: string) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/todos/${Id}/status=${newStatus}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        toast.success("Task status updated!");
        if (fetchStore.user?.userId) {
          await fetchStore.fetchTodosToday(fetchStore.user.userId);
        }
      } else {
        toast.error("Failed to update task status.");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div
        className={`border-b md:border-b-0 md:border-r transition-all duration-300 ${
          isTaskCollapsed ? "w-full md:w-16 p-2" : "w-full md:w-64 p-4"
        }`}
      >
        <div
          className="flex items-center justify-between bg-[#F5DFB5] p-3 cursor-pointer rounded-md"
          onClick={toggleTaskSection}
        >
          {!isTaskCollapsed ? (
            <div className="flex items-center gap-2 text-md font-semibold text-[#4D4C4C]">
              <Notebook size={20} /> All Tasks
            </div>
          ) : (
            <Notebook size={24} className="mx-auto text-[#4D4C4C]" />
          )}
        </div>

        {!isTaskCollapsed && (
          <div className="overflow-y-auto scrollbar-hide max-h-[76vh] mt-4">
            {Object.entries(tasks)
              .sort(
                ([dateA], [dateB]) =>
                  new Date(dateB).getTime() - new Date(dateA).getTime()
              )
              .map(([date, taskList]) => (
                <div key={date} className="mb-4">
                  {/* Date Section */}
                  <div
                    className="text-[14px] cursor-pointer mb-2"
                    onClick={() => toggleDate(date)}
                  >
                    {expandedDates.includes(date) ? "▼" : "▶"} {date}
                  </div>

                  {expandedDates.includes(date) && (
                    <div className="text-[#4D4C4C]">
                      {taskList.map((task, index) => (
                        <div
                          key={index}
                          className="flex flex-col p-2 border rounded-md mb-2 bg-[#F5E8E8]"
                        >
                          <div className="font-normal text-[15px] text-[#333333]">
                            {task.title}
                          </div>

                          <div className="flex flex-col gap-1 mt-2 text-[12px] text-[#333333]">
                            {task.status !== "in_progress" &&
                              task.status !== "completed" && (
                                <label className="flex items-center gap-1">
                                  <input
                                    type="radio"
                                    name={`status-${task.id}`}
                                    value="todo"
                                    className="accent-blue-500"
                                    defaultChecked={task.status === "todo"}
                                    onChange={() =>
                                      handleStatusChange(task.id, "todo")
                                    }
                                  />
                                  To Do
                                </label>
                              )}
                            {task.status === "in_progress" && (
                              <span className="flex items-center text-yellow-600 font-normal">
                                 <span className="mr-2">In Progress</span>
                                <span className="inline-flex">
                                  <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full animate-bounce [animation-delay:0ms]"></span>
                                  <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full animate-bounce [animation-delay:150ms] mx-1"></span>
                                  <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full animate-bounce [animation-delay:300ms]"></span>
                                </span>
                               
                              </span>
                            )}
                            {task.status === "completed" && (
                              <span className="flex items-center text-green-700 font-normal">
                                ✔ Completed
                              </span>
                            )}
                          </div>

                          <div
                            className={`font-normal mt-2 text-[12px] ${
                              task.priority.toUpperCase() === "HIGH"
                                ? "text-red-500"
                                : task.priority.toUpperCase() === "MEDIUM"
                                ? "text-yellow-500"
                                : task.priority.toUpperCase() === "LOW"
                                ? "text-blue-500"
                                : "text-black"
                            }`}
                          >
                            {task.priority}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 bg-white">
        <TaskBoard />
      </div>
    </div>
  );
};

// ✅ Wrap component with observer for MobX reactivity
export default observer(CollapsibleTasks);
