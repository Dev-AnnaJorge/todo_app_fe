import React, { useEffect, useState } from "react";
import TaskContainer from "@/components/TaskContainer";
import { TaskProps } from "@/interfaces";
import { initialCompletedTasks, initialTasks } from "./dataExample";

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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center text-white">
        Task Management
      </h1>
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
  );
};

export default TaskPage;
