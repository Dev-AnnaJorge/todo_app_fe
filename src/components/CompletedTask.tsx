import React from "react";
import TaskScheduled from "./TaskItem";
import { TaskProps } from "@/interfaces";

interface CompletedTasksProps {
  completedTasks: TaskProps[];
  onDelete: (id: number) => void;
}

const CompletedTasks: React.FC<CompletedTasksProps> = ({
  completedTasks,
  onDelete,
}) => {
  return (
    // <div className="max-w-3xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
    //   {/* Section: Completed Tasks */}
    //   {completedTasks.length === 0 ? (
    //     <p className="text-gray-600 text-center">No completed tasks yet!</p>
    //   ) : (
    //     <div className="bg-white p-4 rounded-lg shadow-md max-h-60 overflow-y-auto">
    //       {/* Section: Task List */}
    //       {completedTasks.map((task) => (
    //         <div
    //           key={task.id}
    //           className="bg-gray-200 p-4 rounded-lg shadow mb-4"
    //         >
    //           {/* Subsection: Task Item */}
    //           <TaskItem task={task} onDelete={onDelete} />
    //           {/* Subsection: Completion Date */}
    //           {task.completedDate && (
    //             <p className="text-gray-500 italic">
    //               Completed on: {task.completedDate}
    //             </p>
    //           )}
    //         </div>
    //       ))}
    //     </div>
    //   )}
    // </div>
    <></>
  );
};

export default CompletedTasks;
