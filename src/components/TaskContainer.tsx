"use client";

import { useEffect, useState } from "react";
import { TaskProps } from "@/interfaces";
import TaskScheduled from "./ToDo/TaskItem";
import TaskUnscheduled from "./ToDo/TaskItemUnSchedule";
import CompletedTasks from "./AccomplishedTasks/CompletedTask";
import fetchStore from "@/stores/fetchStore";
import { observer } from "mobx-react-lite";

interface TaskContainerProps {
  onDelete: (id: number) => void;
  onEdit: (updatedTask: TaskProps) => void;
  onApprove: (id: number) => void;
  onSelect: (id: number) => void;
  onCategoryModal: () => void;
  tasksToday: TaskProps[];
}

const TaskContainer: React.FC<TaskContainerProps> = observer(
  ({ onApprove, onSelect, onCategoryModal }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);

      const fetchTasks = async () => {
        if (fetchStore.user) {
          await fetchStore.fetchTodosToday(fetchStore.user.userId);
          await fetchStore.fetchCompletedToday(fetchStore.user.userId);
          await fetchStore.fetchTodos(fetchStore.user.userId);
        }
      };

      fetchTasks();
    }, []);

    if (!isClient) return null; // Prevent hydration mismatch

    const incompleteTasks = fetchStore.tasksToday.filter(
      (task: TaskProps) => !task.completedAt
    );

    return (
      <div className="flex flex-col mt-36 md:mt-0 lg:m-0 md:flex-row gap-8 drop-shadow-2xl relative">
        {/* Incomplete Tasks */}
        <div className="w-full md:flex-1 bg-white shadow-md rounded-lg p-4">
          <h2 className="bg-[#F5DFB5] font-semibold p-3 text-[#444444] text-[16px] sm:text-[18px] md:text-xl">
            Things to do
          </h2>
          <div className="bg-transparent p-4 rounded-lg max-h-[478px] overflow-y-auto scrollbar-hide">
            {incompleteTasks.length > 0 ? (
              incompleteTasks.map((task: TaskProps) => (
                <div key={task.id}>
                  {task.category === "scheduled" ? (
                    <TaskScheduled
                      task={task}
                      onSelect={onSelect}
                      onApprove={onApprove}
                      onCategoryModal={onCategoryModal}
                    />
                  ) : (
                    <TaskUnscheduled
                      task={task}
                      onSelect={onSelect}
                      onApprove={onApprove}
                      onCategoryModal={onCategoryModal}
                    />
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No tasks available.</p>
            )}
          </div>
        </div>
        {/* Completed Tasks */}
        <div className="w-full md:w-2/6">
          <CompletedTasks completedTasks={fetchStore.completedtoday} />
        </div>
      </div>
    );
  }
);

export default TaskContainer;
