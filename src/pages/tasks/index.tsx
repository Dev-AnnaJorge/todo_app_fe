import React, { useEffect, useState } from "react";
import TaskContainer from "@/components/TaskContainer";
import { TaskProps } from "@/interfaces";
import { initialCompletedTasks, initialTasks } from "./dataExample";
import TaskInput from "@/components/ToDo/TaskInput";
import CalendarPopup from "@/Providers/Calendar";
import Categorized from "./Categorized";
import { observer } from "mobx-react-lite";
import fetchStore from "@/stores/fetchStore";
import { format } from "date-fns"; // Import format from date-fns

const TaskPage: React.FC = observer(() => {
  const [tasks, setTasks] = useState<TaskProps[]>(initialTasks);
  const [completedTasks, setCompletedTasks] = useState<TaskProps[]>(
    initialCompletedTasks
  );
  const [isClient, setIsClient] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [scheduled, setScheduled] = useState(true);
  const category = scheduled ? "scheduled" : "unscheduled";

  useEffect(() => {
    setIsClient(true);
    fetchStore.fetchTodos();
    fetchStore.fetchCompleted(format(selectedDate, "yyyy-MM-dd"), category); // Fetch based on selected date
  }, [selectedDate,scheduled]); // Fetch tasks when date changes

  const handleAddTask = (newTask: TaskProps) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  return (
    <div className="mt-5 mx-4 sm:mx-10">
      <div className="flex flex-col sm:flex-row items-center gap-14 w-full">
        <h1 className="text-2xl sm:text-2xl font-bold text-gray-700 ml-12">
          Task Tracker
        </h1>
        <div className="flex-1 w-full sm:w-auto min-w-[200px]">
          <TaskInput onAddTask={handleAddTask} />
        </div>
        <div className="absolute right-36 top-10 z-50">
          <CalendarPopup
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </div>
      </div>
      <div>
        <Categorized selectedDate={selectedDate} tasks={tasks} />
      </div>
    </div>
  );
});

export default TaskPage;
