import { TaskProps } from "@/interfaces";
import React, { useEffect, useState } from "react";
import TaskList from "./TaskList";
import CompletedTasks from "./AccomplishedTasks/CompletedTask";
import TaskInput from "./ToDo/TaskInput";
import axios from "axios";

interface TaskContainerProps {
  tasks: TaskProps[];
  completedTasks: TaskProps[];
  onDelete: (id: number) => void;
  onEdit: (task: TaskProps) => void;
  onApprove: (id: number) => void;
  onAddTask: (task: TaskProps) => void;
  onSelect: (id: number, status: string) => void;
  onCloseModal?: (id: number, category: string) => any;
}

const TaskContainer: React.FC<TaskContainerProps> = ({
  completedTasks,
  onDelete,
  onEdit,
  onApprove,
  onAddTask,
  onSelect,
  onCloseModal,
}) => {
  const [fetchedTasks, setFetchedTasks] = useState<TaskProps[]>([]);
  const [completedTask, setCompletedTask] = useState<TaskProps[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${process.env.API_URL}/api/todos`);
      setFetchedTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleCloseModal = async () => {
    //await setIsModalOpen(false);
    await fetchData();
    console.log(fetchedTasks)
  };

  const fetchCompletdTask = async () => {
    return await axios
      .get(`${process.env.API_URL}/api/todos/completed`)
      .then((res) => {
        setCompletedTask(res.data);
      });
  };
  console.log({ completedTask });

  useEffect(() => {
    fetchData();
    fetchCompletdTask();
  }, []);

  return (
    <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8 p-4 drop-shadow-2xl">
      <div className="bg-[#D9D9D9] shadow-md rounded-lg p-6 flex-1">
        <h2 className="text-xl font-semibold mb-4">Things to do</h2>
        <TaskInput onAddTask={onAddTask} /> <br />
        {fetchedTasks.length === 0 ? (
          <p className="text-gray-500">No tasks available. Add a new task!</p>
        ) : (
          <TaskList
            tasks={fetchedTasks}
            onDelete={onDelete}
            onEdit={onEdit}
            onApprove={onApprove}
            onSelect={onSelect}
            onCategoryModal={handleCloseModal}
          />
        )}
      </div>
      <div className="bg-[#D9D9D9] shadow-md rounded-lg p-6 flex-1">
        <h2 className="text-lg font-semibold mb-4">Accomplished</h2>
        {completedTasks.length === 0 ? (
          <p className="text-gray-500">No completed tasks.</p>
        ) : (
          <CompletedTasks tasksProps={completedTasks} onDelete={onDelete} />
        )}
      </div>
    </div>
  );
};

export default TaskContainer;
