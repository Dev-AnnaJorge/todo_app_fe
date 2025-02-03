import { TaskProps } from "@/interfaces";
import React, { useEffect, useState } from "react";


interface CompletedSchedule {
  task: TaskProps
}

const CompletedSchedule: React.FC<CompletedSchedule> = ({
  task,

}) => {
  
  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full items-center justify-between">
        <div className="flex w-full items-center justify-between bg-[#F5E8E8] p-4 rounded-full shadow">
          <div className="flex flex-col w-2/3">
            <h3 className="text-lg font-semibold cursor-pointer">
              {task.title}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};




export default CompletedSchedule;
