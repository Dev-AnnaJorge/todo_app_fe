import React, { useEffect, useState } from "react";
import TaskContainer from "@/components/TaskContainer";
import { TaskProps } from "@/interfaces";
import { initialCompletedTasks, initialTasks } from "./dataExample";
import TaskInput from "@/components/ToDo/TaskInput";
import CalendarPopup from "@/Providers/Calendar";
import Summary from "@/components/ToDo/TasksSummary/Summary";
import BarGraph from "@/components/WeeklySummary/BarGraph";

const TaskPage: React.FC = () => {
  const [tasks, setTasks] = useState<TaskProps[]>(initialTasks);
  const [completedTasks, setCompletedTasks] = useState<TaskProps[]>(
    initialCompletedTasks
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDelete = (id: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    setCompletedTasks((prevCompleted) =>
      prevCompleted.filter((task) => task.id !== id)
    );
  };

  const handleApprove = (id: number) => {
    const taskToApprove = tasks.find((task) => task.id === id);
    if (taskToApprove) {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      setCompletedTasks((prevCompleted) => [...prevCompleted, taskToApprove]);
    }
  };

  const handleAddTask = (newTask: TaskProps) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleOnSelect = (id: number) => {
    console.log("Task selected with ID:", id);
  };

  const handleEdit = (updatedTask: TaskProps) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  if (!isClient) return null;

  return (
    <div className="mt-5 mx-4 sm:mx-10">
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
        <h1 className="text-xl sm:text-2xl font-bold text-white">
          Productivity Tracker
        </h1>
        <div className="flex-1 w-full sm:w-auto min-w-[200px]">
          <TaskInput onAddTask={handleAddTask} />
        </div>
        <div className="relative w-full sm:w-auto">
          <CalendarPopup />
        </div>
      </div>
      <div>
        <Summary task={tasks[0]} onSave={() => {}} />
      </div>
      <div className="flex justify-start bg-transparent">
      <BarGraph />
    </div>
    </div>
  );
};

export default TaskPage;

{
  /* <TaskContainer
        completedTasks={completedTasks}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onApprove={handleApprove}
        onAddTask={handleAddTask}
        onSelect={handleOnSelect}
        tasks={tasks}
      /> */
}
