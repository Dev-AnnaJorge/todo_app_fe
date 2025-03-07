import { TaskProps } from "@/interfaces";
import React, { useEffect, useState } from "react";
import { Undo2, Pencil } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import fetchStore from "@/stores/fetchStore";

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
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [note, setNote] = useState(task.note);
  const [isPencilHovered, setIsPencilHovered] = useState(false);
  const [isUndoHovered, setIsUndoHovered] = useState(false);

  const formatDate = (dateString: string) => {
    const dateObj = new Date(dateString?.replace(" ", "T"));
    return `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  useEffect(() => {
    setFormattedDate(task.updatedAt);
    setCompletedDate(task.completedAt);
    setEffortBurn(task.effortBurn);
    setNote(task.note);
  }, [task.updatedAt]);

  const handleUndo = async () => {
    try {
      await axios.put(`${process.env.API_URL}/api/todos/${task.id}/status=in_progress`);
      toast.success("Task moved back to In Progress!");
      fetchStore.updateTaskStatus(task.id, "in_progress");
      await fetchStore.fetchTodosToday(fetchStore.user!.userId);
      await fetchStore.fetchCompletedToday(fetchStore.user!.userId);
      await fetchStore.fetchSummary(fetchStore.user!.userId);
    } catch (error) {
      toast.error("Failed to undo task completion.");
      console.error("Error updating task status:", error);
    }
  };

  const handleSaveNote = async () => {
    try {
      await fetchStore.addNoteByTask(task.id, note);
      toast.success("Note added successfully!");
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to add note.");
      console.error("Error saving note:", error);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full items-center justify-between">
        <div className="flex w-full items-center bg-[#F5E8E8] hover:bg-white p-4 rounded-lg">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col w-2/3">
              <h3 className="text-sm sm:text-sm md:text-lg text-[#4D4C4C] cursor-pointer">
                {task.title}
              </h3>
              <h3 className="text-[14px] text-[#4D4C4C] cursor-pointer">
                Date: {formatDate(task.updatedAt || "")} -{" "}
                {formatDate(task.completedAt || "")}
              </h3>
            </div>
            <div
              className="flex items-center text-[#4D4C4C] text-[14px] gap-2 relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {task.effortBurn} {task.effortBurn === 1 ? "Hr" : "Hrs"}
              {isHovered && (
                <>
                  <div
                    className="relative"
                    onMouseEnter={() => setIsUndoHovered(true)}
                    onMouseLeave={() => setIsUndoHovered(false)}
                  >
                    <Undo2
                      className="w-4 h-4 text-gray-500 cursor-pointer hover:text-black transition"
                      onClick={handleUndo}
                    />
                    {isUndoHovered && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap shadow-lg z-10">
                        {"Undo"}
                      </div>
                    )}
                  </div>
                  <div
                    className="relative"
                    onMouseEnter={() => setIsPencilHovered(true)}
                    onMouseLeave={() => setIsPencilHovered(false)}
                  >
                    <Pencil
                      className="w-4 h-4 text-gray-500 cursor-pointer hover:text-black transition"
                      onClick={() => setIsModalOpen(true)}
                    />
                    {isPencilHovered && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#F5DFB5] text-gray-700 text-xs rounded py-2 px-3 shadow-lg z-10 max-w-xs whitespace-pre-wrap break-words text-left">
                        {note ? note : "Add Note"}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Add Note</h2>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-2 border rounded-lg mb-4"
              placeholder="Write your note here..."
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-red-200 text-gray-700 rounded-lg"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#dcedc1] text-gray-600 rounded-lg"
                onClick={handleSaveNote}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletedSchedule;
