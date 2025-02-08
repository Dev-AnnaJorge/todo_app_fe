import React, { useEffect, useState } from "react";
import TaskContainer from "@/components/TaskContainer";
import { observer } from "mobx-react-lite";
import Summary from "@/components/ToDo/TasksSummary/Summary";
import BarGraph from "@/components/WeeklySummary/BarGraph";
import fetchStore from "@/stores/fetchStore";
import { format } from "date-fns"; 

interface CategorizedProps {
  selectedDate: Date;
}

const Categorized: React.FC<CategorizedProps> = observer(({ selectedDate }) => {
  const [isClient, setIsClient] = useState(false);
  const [scheduled, setScheduled] = useState(true);

  useEffect(() => {
    setIsClient(true);
    const formattedDate = format(selectedDate, "yyyy-MM-dd");

    fetchStore.fetchTodos();
    fetchStore.fetchSummary(formattedDate);
    fetchStore.fetchWeeklyTasks("scheduled");
    fetchStore.AllNotes("content", formattedDate);
  }, [selectedDate]); // Re-run when selectedDate changes

  if (!isClient) return null;

  return (
    <div className="mx-4 sm:mx-10">
      {/* Radio Button */}
      <div className="flex items-center space-x-2">
        <div
          className={`w-5 h-5 border-2 rounded-full flex items-center justify-center cursor-pointer ${
            scheduled ? "bg-[#FEA400] border-gray-700" : "border-gray-700"
          }`}
          onClick={() => setScheduled(!scheduled)}
        >
          {scheduled && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
        </div>
        <span className="text-gray-700 select-none">
          {scheduled ? "Scheduled" : "Unscheduled"}
        </span>
      </div>

      {/* Summary */}
      <div>
        <Summary task={fetchStore.tasks[0]} onSave={() => {}} />
      </div>

      {/* Bar Graph */}
      <div className="flex justify-start bg-transparent px-4">
        <BarGraph />
      </div>

      {/* Task Container */}
      <div>
        <TaskContainer
          completedTasks={fetchStore.completedTasks}
          onDelete={fetchStore.deleteTask}
          onEdit={fetchStore.editTask}
          onApprove={fetchStore.approveTask}
          onAddTask={fetchStore.addTask}
          onSelect={(id) => console.log("Task selected with ID:", id)}
          tasks={fetchStore.tasks}
        />
      </div>
    </div>
  );
});

export default Categorized;
