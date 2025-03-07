"use client";
import { TaskProps } from "@/interfaces/Task";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import fetchStore from "@/stores/fetchStore";
import { FileDown } from "lucide-react";

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "text-red-500";
    case "medium":
      return "text-yellow-500";
    case "low":
      return "text-blue-500";
    default:
      return "text-gray-500";
  }
};

// ✅ CSV Export Function
const exportCompletedTasksToCSV = () => {
  const tasks = fetchStore.completedTasks;
  if (!tasks.length) {
    alert("No completed tasks to export.");
    return;
  }

  // Define CSV headers
  const headers = [
    "Title",
    "Category",
    "Priority",
    "Effort Burn",
    "Completed At",
  ];
  const rows = tasks.map((task) => [
    task.title,
    task.category,
    task.priority,
    `${task.effortBurn} ${task.effortBurn === 1 ? "Hr" : "Hrs"}`,
    new Date(task.completedAt).toLocaleDateString(),
  ]);

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  // Trigger file download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "completed_tasks.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const TaskBoard: React.FC = observer(() => {
  useEffect(() => {
    const fetchTasks = async () => {
      if (fetchStore.user) {
        await fetchStore.fetchBacklog(fetchStore.user.userId);
        await fetchStore.fetchCompleted(fetchStore.user.userId);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Backlog Section */}
      <div className="w-full lg:w-1/2 bg-white rounded-lg max-h-[45vh] lg:max-h-[80vh] flex flex-col">
        <h2 className="text-xl font-semibold text-[#4D4C4C] p-4 bg-white sticky top-0 z-10 border-b">
          Backlog
        </h2>
        <div className="overflow-y-auto scrollbar-hide p-4 flex-1">
          {fetchStore.backlog.length === 0 ? (
            <p className="text-gray-500">No backlog tasks</p>
          ) : (
            fetchStore.backlog
              .filter((task: TaskProps) => task.status === "not_set")
              .map((task) => (
                <div
                  key={task.id}
                  className="relative group bg-[#F5DFB5] p-3 rounded-md mb-2 text-[#4D4C4C] flex justify-between items-center"
                >
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#F5E8E8] bg-opacity-80 text-[#44444] text-xs rounded-md py-2 px-4 shadow-lg z-10 hidden group-hover:flex whitespace-pre-wrap break-words">
                    <span className="font-medium">{task.description}</span>
                  </div>
  
                  <div className="flex flex-col">
                    <span>{task.title}</span>
                    <span className="text-sm text-gray-600">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[12px] text-gray-600">
                      {task.category.toUpperCase()}
                    </span>
                    <span
                      className={`text-[12px] ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {task.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
  
      {/* Divider (hidden on mobile) */}
      <div className="hidden lg:block w-[2px] bg-[#F5E8E8]"></div>
  
      {/* Completed Tasks Section */}
      <div className="w-full lg:w-1/2 bg-white rounded-lg max-h-[45vh] lg:max-h-[80vh] flex flex-col">
        <h2 className="text-xl font-semibold text-[#4D4C4C] p-4 bg-white sticky top-0 z-10 border-b flex justify-between items-center">
          Accomplishments
          <button
            onClick={exportCompletedTasksToCSV}
            className="text-gray-600 hover:text-gray-800"
          >
            <FileDown size={30} />
          </button>
        </h2>
        <div className="overflow-y-auto scrollbar-hide p-4 flex-1">
          {fetchStore.completedTasks.length === 0 ? (
            <p className="text-gray-500">No completed tasks</p>
          ) : (
            fetchStore.completedTasks
              .slice()
              .sort(
                (a: TaskProps, b: TaskProps) =>
                  new Date(b.completedAt).getTime() -
                  new Date(a.completedAt).getTime()
              )
              .map((task: TaskProps) => (
                <div
                  key={task.id}
                  className="relative group bg-[#dcedc1] p-3 rounded-md mb-2 flex justify-between items-center"
                >
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#F5E8E8] bg-opacity-80 text-[#44444] text-xs rounded-md py-2 px-4 shadow-lg z-10 hidden group-hover:flex whitespace-pre-wrap break-words">
                    <div className="flex gap-4">
                      <span className="font-medium">{task.description}</span>
                      <span className="font-medium">{task.note}</span>
                    </div>
                  </div>
  
                  <span>{task.title}</span>
                  <div className="flex flex-col text-sm text-gray-600 text-right">
                    <span>
                      {new Date(task.completedAt).toLocaleDateString()}
                    </span>
                    <span className="text-blue-700">
                      {task.effortBurn} {task.effortBurn === 1 ? "Hr" : "Hrs"}
                    </span>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
  
});

export default TaskBoard;
