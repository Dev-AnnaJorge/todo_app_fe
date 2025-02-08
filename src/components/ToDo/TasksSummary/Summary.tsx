import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSave } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { TaskProps } from "@/interfaces";
import { ResponsiveContainer } from "recharts";
import fetchStore from "@/stores/fetchStore";

interface EditableNoteProps {
  task?: TaskProps; // Make task optional to prevent crashes
  onSave: (newContent: string) => void;
}

const Summary: React.FC<EditableNoteProps> = observer(({ task, onSave }) => {
  const summary = fetchStore.summaryTasks; // Reactive summary state
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState<string>(task?.content || "");
  const note = fetchStore.content;

  

  const handleEditClick = () => setIsEditing(true);
  const handleSaveClick = () => {
    onSave(newContent);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewContent(e.target.value);
  };

  return (
    <ResponsiveContainer width="100%" height={160}>
      <div className="w-full flex space-x-4 p-4">
        {/* To-Do Box */}
        <div className="w-1/2 h-32 bg-[#F5DFB5] flex flex-col items-start justify-center rounded-lg shadow-lg relative p-4">
          <span className="absolute top-2 text-outline text-lg">To-Do</span>
          <div className="text-gray-600 mt-8 font-semibold text-[40px]">
            {summary[0]?.todo || "Not Started"}
          </div>
        </div>

        {/* In Progress Box */}
        <div className="w-1/2 h-32 bg-[#F5DFB5] flex flex-col items-start justify-center rounded-lg shadow-lg relative p-4">
          <span className="absolute top-2 text-outline text-lg">In Progress</span>
          <div className="text-gray-600 mt-8 font-semibold text-[40px]">
            {summary[0]?.inprogress || "Not Started"}
          </div>
        </div>

        {/* Completed Box */}
        <div className="w-1/2 h-32 bg-[#F5DFB5] flex flex-col items-start justify-center rounded-lg shadow-lg relative p-4">
          <span className="absolute top-2 text-outline text-lg">Completed</span>
          <div className="text-gray-600 mt-8 font-semibold text-[40px]">
            {summary[0]?.completed || "Not Started"}
          </div>
        </div>

        {/* What Went Wrong Box */}
        <div className="w-1/2 h-32 bg-[#F5DFB5] flex flex-col items-start justify-center rounded-lg shadow-lg relative p-4">
          <span className="absolute top-2 text-outline text-lg mb-4">
            What Went Wrong?
          </span>
          {isEditing ? (
            <textarea
              value={note}
              onChange={handleChange}
              autoFocus
              className="text-gray-700 bg-transparent w-full outline-none mt-6"
            />
          ) : (
            <p className="text-gray-700 mt-8">{newContent || "Please Input Note."}</p>
          )}
          <div className="w-full flex justify-end mt-4">
            {isEditing ? (
              <button
                onClick={handleSaveClick}
                className="text-[#171717] px-2 py-2 rounded flex items-center hover:bg-gray-300 transition"
              >
                <FontAwesomeIcon icon={faSave} className="h-5 w-5" />
              </button>
            ) : (
              <button
                onClick={handleEditClick}
                className="text-[#171717] px-2 py-2 rounded-full flex items-center hover:bg-gray-300 transition"
              >
                <FontAwesomeIcon icon={faPlus} className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </ResponsiveContainer>
  );
});

export default Summary;
