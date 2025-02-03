import { TaskProps } from "@/interfaces";
import React, { useEffect, useState } from "react";

interface TaskScheduledProps {
  task: TaskProps;
}

const CompletedUnSchedule: React.FC<TaskScheduledProps> = ({ task }) => {
  const [Date, setDate] = useState<string | undefined>(task.createdAt);

  useEffect(() => {
    setDate(task.createdAt);
  }, [task.createdAt]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full items-center justify-between">
        <div className="flex w-full items-center justify-between bg-[#F5E8E8] p-4 rounded-lg mt-2">
          <div className="flex flex-col w-2/3">
            <h3 className="text-lg font-semibold cursor-pointer">
              {task.title}
            </h3>
            <h6 className="text-[14px] text-gray-400 cursor-pointer">
              Date: {task.createdAt} - {task.completedAt}
            </h6>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletedUnSchedule;
