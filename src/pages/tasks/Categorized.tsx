import React, { useEffect, useState } from "react";
import TaskContainer from "@/components/TaskContainer";
import { TaskProps } from "@/interfaces";
import { initialCompletedTasks, initialTasks } from "./dataExample";
import Summary from "@/components/ToDo/TasksSummary/Summary";
import BarGraph from "@/components/WeeklySummary/BarGraph";

const Categorized: React.FC = () => {
  const [tasks, setTasks] = useState<TaskProps[]>(initialTasks);
  const [completedTasks, setCompletedTasks] = useState<TaskProps[]>(
    initialCompletedTasks
  );
  const [isClient, setIsClient] = useState(false);
  const [scheduled, setScheduled] = useState(true);

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
        <Summary task={tasks[0]} onSave={() => {}} />
      </div>

      {/* Bar Graph */}
      <div className="flex justify-start bg-transparent px-4">
        <BarGraph />
      </div>

      {/* Task Container */}
      <div>
        <TaskContainer
          completedTasks={completedTasks}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onApprove={handleApprove}
          onAddTask={handleAddTask}
          onSelect={handleOnSelect}
          tasks={tasks}
        />
      </div>
    </div>
  );
};

export default Categorized;
