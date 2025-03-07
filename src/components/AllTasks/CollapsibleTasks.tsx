import { useState } from "react";
import { Notebook } from "lucide-react";
import TaskBoard from "./TaskBoard";
import BarGraph from "../WeeklySummary/BarGraph";
import { TaskProps } from "@/interfaces";

interface Task {
  title: string;
  priority: string;
}

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

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div
        className={`border-b md:border-b-0 md:border-r transition-all duration-300 ${
          isTaskCollapsed
            ? "w-full md:w-16 p-2"
            : "w-full md:w-64 p-4"
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
                          <div className="font-semibold text-[14px]">
                            {task.title}
                          </div>
  
                          <div className="flex flex-col gap-1 mt-2 text-[12px]">
                            {task.status !== "completed" && (
                              <label className="flex items-center gap-1">
                                <input
                                  type="radio"
                                  name={`status-${task.id}`}
                                  value="todo"
                                  className="accent-blue-500"
                                  defaultChecked={task.status === "todo"}
                                />
                                To Do
                              </label>
                            )}
                            <label className="flex items-center gap-1">
                              <input
                                type="radio"
                                name={`status-${task.id}`}
                                value="completed"
                                className="accent-green-500"
                                defaultChecked={task.status === "completed"}
                              />
                              Completed
                            </label>
                          </div>
  
                          <div
                            className={`font-semibold mt-2 text-[12px] ${
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
        {/* <BarGraph /> */}
      </div>
    </div>
  );
  
};

export default CollapsibleTasks;
