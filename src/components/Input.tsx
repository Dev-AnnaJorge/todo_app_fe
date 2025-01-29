// components/TaskInput.js
import React, { useState } from "react";

const TaskInput = () => {
  const [priority, setPriority] = useState("HIGH");

  const handlePriorityChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setPriority(event.target.value);
  };

  // Determine the color based on the selected priority
  const priorityColor = {
    HIGH: "text-red-500",
    MEDIUM: "text-yellow-500",
    LOW: "text-green-500",
  }[priority];

  return (
    <div className="bg-gray-200 p-4 rounded-lg flex items-center justify-between">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Task Title..."
          className="bg-transparent border-none text-lg outline-none placeholder-gray-500"
        />
        <p className="text-gray-600">Description</p>
      </div>
      <div className="flex items-center">
        <select
          value={priority}
          onChange={handlePriorityChange}
          className={`border border-gray-300 rounded-md p-1 mr-2 ${priorityColor} bg-transparent`}
        >
          <option value="HIGH">HIGH</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="LOW">LOW</option>
        </select>
        <button className="bg-gray-300 p-2 rounded-full text-gray-700 hover:bg-gray-400">
          +
        </button>
      </div>
    </div>
  );
};

export default TaskInput;
