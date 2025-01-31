import { TaskProps } from "@/interfaces";
import React from "react";
import TaskList from "./TaskList";
import CompletedTasks from "./CompletedTask";
import TaskInput from "./TaskInput";

interface TaskContainerProps {
  tasks: TaskProps[];
  completedTasks: TaskProps[];
  onDelete: (id: number) => void;
  onEdit: (task: TaskProps) => void;
  onApprove: (id: number) => void;
  onAddTask: (task: TaskProps) => void; 
}

const TaskContainer: React.FC<TaskContainerProps> = ({
  tasks,
  completedTasks,
  onDelete,
  onEdit,
  onApprove,
  onAddTask,
}) => {
  return (
    <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8 p-4 drop-shadow-2xl ">
      <div className="bg-[#D9D9D9] shadow-md rounded-lg p-6 flex-1">
      <h2 className="text-xl font-semibold mb-4">Things to do</h2>
      <TaskInput onAddTask={onAddTask} /> <br />
        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks available. Add a new task!</p>
        ) : (
          <TaskList
            tasks={tasks}
            onDelete={onDelete}
            onEdit={onEdit}
            onApprove={onApprove}
          />
        )}
      </div>
      <div className="bg-[#D9D9D9] shadow-md rounded-lg p-6 flex-1">
        <h2 className="text-lg font-semibold mb-4">Accomplished</h2>
        {completedTasks.length === 0 ? (
          <p className="text-gray-500">No completed tasks.</p>
        ) : (
          <CompletedTasks completedTasks={completedTasks} onDelete={onDelete} />
        )}
      </div>
    </div>
  );
};

export default TaskContainer;
