import React, { useCallback, useEffect, useState } from "react";
import TaskContainer from "@/components/TaskContainer";
import { observer } from "mobx-react-lite";
import Summary from "@/components/ToDo/TasksSummary/Summary";
import BarGraph from "@/components/WeeklySummary/BarGraph";
import fetchStore from "@/stores/fetchStore";
import { format } from "date-fns";
import { TaskProps } from "@/interfaces";

interface CategorizedProps {
  selectedDate: Date;
  tasks: TaskProps[];
}

const Categorized: React.FC<CategorizedProps> = observer(({ selectedDate }) => {
  const [isClient, setIsClient] = useState(false);
  const [scheduled, setScheduled] = useState(true);

  // Fetch data when selectedDate or scheduled changes
  const requestUpdate = useCallback( async ()=>{
    setIsClient(true);
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    const category = scheduled ? "scheduled" : "unscheduled";

    // Fetch all necessary data
    await fetchStore.fetchTodos();
    await  fetchStore.fetchTodoByDate(formattedDate, category);
    await fetchStore.fetchSummary(formattedDate, category);
    await fetchStore.fetchWeeklyTasks(category);
    await fetchStore.fetchCompleted(formattedDate, category);
  },[selectedDate, scheduled])
  
  useEffect(() => {
    requestUpdate();
  }, [selectedDate, scheduled]); // Ensure selectedDate is a dependency

  return (
    <div className="mx-4 sm:mx-10">
      {/* Radio Button Toggle */}
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => setScheduled((prev)=>!prev)}
      >
        <div
          className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
            scheduled ? "bg-[#FEA400] border-gray-700" : "border-gray-700"
          }`}
        >
          {scheduled && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
        </div>
        <span className="text-gray-700 select-none">
          {scheduled ? "Scheduled" : "Unscheduled"}
        </span>
      </div>

      {/* Summary */}
      <Summary
        selectedDate={selectedDate}
        task={fetchStore.tasks[0]}
        notes={fetchStore.notes[0]}
        onSave={() => {}}
      />

      {/* Bar Graph */}
      <div className="flex justify-start bg-transparent px-4">
        <BarGraph scheduled={scheduled} />
      </div>

      {/* Task Container */}
      <TaskContainer
        selectedDate={selectedDate}
        scheduled={scheduled}
        onDelete={fetchStore.deleteTask}
        onEdit={fetchStore.editTask}
        onApprove={(id) => fetchStore.approveTask(id, new Date().toISOString())}
        onSelect={(id) => console.log("Task selected with ID:", id)}
        onCategoryModal={() => {}}
        tasks={fetchStore.tasks}
      />
    </div>
  );
});

export default Categorized;