import { TaskProps } from "@/interfaces";
import fetchStore from "@/stores/fetchStore";
import { format, isSameDay } from "date-fns";
import TaskScheduled from "./ToDo/TaskItem";
import TaskUnscheduled from "./ToDo/TaskUnscheduled";

import { useEffect, useState } from "react";

interface TaskContainerProps {
  tasks: TaskProps[];
  onDelete: (id: number) => void;
  onEdit: (task: TaskProps) => void;
  onApprove: (id: number) => void;
  onSelect: (id: number, status: string) => void;
  onCategoryModal: (id: number, category: string) => any;
  onCloseModal?: (id: number, category: string) => void;
  selectedDate: Date;
  scheduled: boolean;
}

const TaskContainer: React.FC<TaskContainerProps> = ({
  tasks,
  onDelete,
  onApprove,
  onSelect,
  onCategoryModal,
  onCloseModal,
  selectedDate,
  scheduled,
}) => {
  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  const filteredTasks = tasks.filter((task) => {
    const isTaskOnSelectedDate = isSameDay(
      new Date(task.createdAt),
      selectedDate
    );
    const isScheduled =
      task.category === (scheduled ? "scheduled" : "unscheduled");
    return isScheduled && isTaskOnSelectedDate;
  });

  useEffect(() => {
    const category = scheduled ? "scheduled" : "unscheduled";
    fetchStore.fetchTodos();
    fetchStore.fetchTodoByDate(formattedDate, category);
  }, [selectedDate, scheduled, formattedDate]);

  return (
    <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8 pt-4 px-4 drop-shadow-2xl h-[480px]">
      <div className="bg-white shadow-md rounded-lg p-6 flex-1">
        <h2 className="bg-[#F5DFB5] text-xl font-semibold mb-4 p-3">
          Things to do
        </h2>
        <h1 className="text-xl font-semibold">
          {scheduled ? "Scheduled" : "Unscheduled"}
        </h1>
        <div className="bg-transparent p-4 rounded-lg shadow-md h-80 overflow-y-auto">
          {filteredTasks.length === 0 ? (
            <p className="text-gray-500">
              No {scheduled ? "scheduled" : "unscheduled"} tasks available.
            </p>
          ) : (
            filteredTasks.map((task: TaskProps) =>
              scheduled ? (
                <TaskScheduled
                  key={task.id}
                  task={task}
                  onSelect={onSelect}
                  onApprove={onApprove}
                  onCategoryModal={onCategoryModal}
                />
              ) : (
                <TaskUnscheduled
                  key={task.id}
                  task={task}
                  onSelect={onSelect}
                  onApprove={onApprove}
                  onCategoryModal={onCategoryModal}
                />
              )
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskContainer;
