import { TaskProps } from "@/interfaces";
import React, { useEffect, useState } from "react";

interface CompletedSchedule {
  task: TaskProps;
}

const CompletedSchedule: React.FC<CompletedSchedule> = ({ task }) => {
  const [formattedDate, setFormattedDate] = useState<string | undefined>(
    task.createdAt
  );
  const [completedDate, setCompletedDate] = useState<string | undefined>(
    task.completedAt
  );
  const [effortBurn, setEffortBurn] = useState<number | undefined>(
    task.effortBurn
  );

  const formatDate = (dateString: string) => {
    const dateObj = new Date(dateString?.replace(" ", "T"));
    return `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };
  useEffect(() => {
    setFormattedDate(task.createdAt);
    setCompletedDate(task.completedAt);
    setEffortBurn(task.effortBurn);
  }, [task.createdAt]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full items-center justify-between">
        <div className="flex w-full items-center bg-[#F5E8E8] p-4 rounded-lg mt-2">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col w-2/3">
              <h3 className="text-lg font-semibold cursor-pointer">
                {task.title}
              </h3>
              <h3 className="text-[14px] text-gray-400 cursor-pointer">
                Date: {formatDate(task.createdAt || "")} -
                {formatDate(task.completedAt || "")}
              </h3>
            </div>
            <div className="flex items-center text-[#B1A9A9] text-[14px]">
              {task.effortBurn} {task.effortBurn == 1 ? "Hr" : "Hrs"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletedSchedule;
