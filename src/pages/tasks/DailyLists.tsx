import React, { useCallback, useEffect, useState } from "react";
import TaskContainer from "@/components/TaskContainer";
import { observer } from "mobx-react-lite";
import Summary from "@/components/ToDo/TasksSummary/Summary";
import fetchStore from "@/stores/fetchStore";
import { format } from "date-fns";
import { TaskProps } from "@/interfaces";
import CollapsibleTasks from "@/components/AllTasks/CollapsibleTasks";

interface CategorizedProps {
  selectedDate: Date;
  tasks: TaskProps[];
}

const DailyLists: React.FC<CategorizedProps> = observer(({ selectedDate }) => {
  const [isClient, setIsClient] = useState(false);
  const [scheduled, setScheduled] = useState(true);

  const requestUpdate = useCallback(async () => {
    setIsClient(true);

    const userId = fetchStore.user?.userId;
    if (!userId) return;

    if (userId !== undefined) {
      await fetchStore.fetchTodos(userId);
      await fetchStore.fetchTodosToday(userId);
      await fetchStore.fetchSummary(userId);
      await fetchStore.fetchCompletedToday(userId);
    }
  }, [selectedDate, scheduled]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (fetchStore.user?.userId) {
      requestUpdate();
    }
  }, [fetchStore.user?.userId, selectedDate, scheduled]);

  const todayDate = format(new Date(), "MMMM dd, yyyy");

  return (
    <div className="m-0 sm:my-6 sm:mx-10 flex flex-col relative">
      <h2 className="text-[14px] sm:text-[14px] md:text-[20px] font-semibold text-[#808080] m-3">
        Today's Date : {todayDate}
      </h2>

      <Summary
        tasksToday={fetchStore.tasksToday[0]}
        notes={fetchStore.notes[0]}
        onSave={() => {}}
        selectedDate={selectedDate}
      />

      <TaskContainer
        onDelete={fetchStore.deleteTask}
        onEdit={fetchStore.editTask}
        onApprove={(id) => fetchStore.approveTask(id, new Date().toISOString())}
        onSelect={(id) => console.log("Task selected with ID:", id)}
        onCategoryModal={() => {}}
        tasksToday={fetchStore.tasksToday}
      />
    </div>
  );
});

export default DailyLists;
