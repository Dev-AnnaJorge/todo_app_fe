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
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);

    const updatedCompletedTasks = completedTasks.filter(
      (task) => task.id !== id
    );
    setCompletedTasks(updatedCompletedTasks);
  };

  const handleApprove = (id: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);

    const updatedCompletedTasks = completedTasks.filter(
      (task) => task.id !== id
    );
    setCompletedTasks(updatedCompletedTasks);
  };

  // Function to handle editing a task
  const handleEdit = (updatedTask: TaskProps) => {
    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Task Management</h1>
      <TaskContainer
        completedTasks={completedTasks}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onApprove={handleApprove}
        tasks={tasks}
      />
    </div>
  );
};

export default TaskPage;
