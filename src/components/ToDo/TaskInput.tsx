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
  const [selectedCategory, setSelectedCategory] = useState("scheduled");
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  ); // Default to today

  const handlePriorityChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPriority(event.target.value);
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const category = event.target.value;
    setSelectedCategory(category);

    // If "unscheduled" is selected, force the date to be today
    if (category === "unscheduled") {
      setSelectedDate(format(new Date(), "yyyy-MM-dd"));
    }
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const handleAddTask = async () => {
    if (!title || !description) {
      toast.error("Please fill in all fields");
      return;
    }

    const today = format(new Date(), "yyyy-MM-dd");
    if (selectedCategory === "scheduled" && selectedDate === today) {
      toast.error("Cannot add a task for today");
      return;
    }

    try {
      const payload = {
        title,
        description,
        priority,
        category: selectedCategory.toLowerCase(),
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
      setSelectedCategory("scheduled");
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
  const tomorrowDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="bg-[#F5E8E8] p-4 rounded-md flex items-center justify-between w-10/12">
      <div className="flex-1 font-bold flex flex-col">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task Title..."
          className="bg-transparent border-none text-lg outline-none placeholder-gray-500"
          maxLength={50}
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="text-gray-600 text-[12px] bg-transparent border-none outline-none mt-2"
          maxLength={70}
        />
      </div>

      <div className="flex items-center text-[12px] space-x-2">
        <select
          value={priority}
          onChange={handlePriorityChange}
          className={`rounded-md p-1 ${priorityColor} bg-transparent`}
        >
          <option value="high">HIGH</option>
          <option value="medium">MEDIUM</option>
          <option value="low">LOW</option>
        </select>

        <select
          value={selectedCategory.toLowerCase()}
          onChange={handleCategoryChange}
          className="rounded-md p-1 bg-transparent"
        >
          <option value="scheduled">Scheduled</option>
          <option value="unscheduled">Unscheduled</option>
        </select>

        {/* Date Picker for selecting dates */}
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="rounded-md p-1 bg-transparent border border-gray-300"
          min={selectedCategory === "scheduled" ? tomorrowDate : todayDate} // Scheduled: allow today & future, Unscheduled: only today
          max={selectedCategory === "unscheduled" ? todayDate : undefined} // Unscheduled: restrict to today
          disabled={selectedCategory === "unscheduled"} // Disable manual selection for unscheduled
        />

        <button
          className="bg-transparent p-2 rounded-full border border-[#FEA400] text-[#FEA400] hover:bg-[#f5e1bc] transition"
          onClick={handleAddTask}
        >
          <FontAwesomeIcon icon={faPlus} className="w-5" />
        </button>
      </div>
    </div>
  );
};

export default TaskInput;
