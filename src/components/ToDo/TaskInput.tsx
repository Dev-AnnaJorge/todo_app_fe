import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { TaskProps } from "@/interfaces";
import fetchStore from "@/stores/fetchStore";

const TaskInput = ({ onAddTask }: { onAddTask: (task: TaskProps) => void }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("high");
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );

  const handlePriorityChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPriority(event.target.value);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const handleAddTask = async () => {
    if (!title || !description) {
      toast.error("Please fill in all fields");
      return;
    }

    const userId = fetchStore.user?.userId;

    if (!userId) {
      toast.error("No user logged in");
      return;
    }

    const today = format(new Date(), "yyyy-MM-dd");
    const category = selectedDate === today ? "unscheduled" : "scheduled";

    try {
      const payload = {
        userId,
        title,
        description,
        priority,
        category: category.toLowerCase(),
        createdAt: new Date(selectedDate),
      };

      const response = await axios.post(
        `${process.env.API_URL}/api/todos`,
        payload
      );

      toast.success("Task added successfully!");
      const { task } = response.data;

      if (task) {
        fetchStore.addTask(task);
        onAddTask(task);
      }

      setTitle("");
      setDescription("");
      setPriority("high");
      setSelectedDate(format(new Date(), "yyyy-MM-dd"));

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      toast.error("Failed to add task");
    }
  };

  const priorityColor = {
    high: "text-red-500",
    medium: "text-yellow-500",
    low: "text-blue-500",
  }[priority];

  const today = new Date();
  const todayDate = format(today, "yyyy-MM-dd");
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  return (
    <div className="bg-white p-2 rounded-md flex flex-col md:flex-row items-start md:items-center justify-between w-full md:w-1/2 gap-2 md:gap-4">
      <div className="flex-1 font-bold flex flex-col w-full">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task Title..."
          className="bg-transparent border-none text-lg outline-none placeholder-gray-500 w-full sm:text-sm"
          maxLength={50}
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="text-gray-600 text-[12px] bg-transparent border-none outline-none mt-2 w-full"
          maxLength={70}
        />
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center text-[12px] gap-2 w-full md:w-auto">
        <select
          value={priority}
          onChange={handlePriorityChange}
          className={`rounded-md p-1 ${priorityColor} bg-transparent w-full md:w-auto`}
        >
          <option value="high">HIGH</option>
          <option value="medium">MEDIUM</option>
          <option value="low">LOW</option>
        </select>

        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="rounded-md p-1 bg-transparent border border-gray-300 w-full md:w-auto"
          min={todayDate}
        />

        <button
          className="bg-transparent p-2 rounded-full border border-[#FEA400] text-[#FEA400] hover:bg-[#f5e1bc] transition w-full md:w-auto"
          onClick={handleAddTask}
        >
          <FontAwesomeIcon icon={faPlus} className="w-5 mx-auto" />
          <span>Add Task</span>
        </button>
      </div>
    </div>
  );
};

export default TaskInput;
