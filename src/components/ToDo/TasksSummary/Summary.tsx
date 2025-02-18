import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faSave } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { TaskNoteProps, TaskProps } from "@/interfaces";
import { ResponsiveContainer } from "recharts";
import fetchStore from "@/stores/fetchStore";
import { format, set } from "date-fns";
import toast from "react-hot-toast";

interface EditableNoteProps {
  task?: TaskProps;
  notes?: TaskNoteProps; // Make notes optional to avoid undefined issues
  onSave: (newContent: string) => void;
  selectedDate: Date;
}

const Summary: React.FC<EditableNoteProps> = observer(
  ({ notes, onSave, selectedDate }) => {
    const summary = fetchStore.summaryTasks;
    const [isEditing, setIsEditing] = useState(false);
    const [isDisable, setIsDisabled] = useState(false);
    const [content, setContent] = useState<string>("");

    useEffect(() => {
      const fetchData = async () => {
        try {
          const formattedDate = format(selectedDate, "yyyy-MM-dd");
          const currentDate = format(new Date(),"yyyy-MM-dd");
          
          setIsDisabled(formattedDate.toString() == currentDate.toString() ? false : true);        
         
          await fetchStore.fetchNotesByDate(formattedDate);
          console.log(
            "Fetched notes content:",
            fetchStore.notesbydate?.content
          );
          setContent(fetchStore.notesbydate?.content || "");
        } catch (error) {
          console.error("Error fetching notes:", error);
          setContent(""); 
        }
      };
      fetchData();
    }, [selectedDate]);

    const handleEditClick = () => setIsEditing(true);    

    const handleSaveClick = async () => {
      if (content.length === 0) {
        toast.error("The field is empty");
        return;
      }
      try {
        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        if (fetchStore.notesbydate?.content) {
          await fetchStore.updateNoteByDate(formattedDate, content);
        } else {
          await fetchStore.fetchNotes(formattedDate, content);
        }
        toast.success("Note saved successfully!");
        onSave(content);
        setIsEditing(false);

        // Refresh the notes to display the updated content
        await fetchStore.fetchNotesByDate(formattedDate);
      } catch (error) {
        console.error("Error saving note:", error);
        toast.error("Failed to save note.");
      }
    };
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
    };

    return (
      <ResponsiveContainer width="100%" height={160}>
        <div className="w-full flex space-x-4 p-4">
          {/* To-Do Box */}
          <div className="w-1/2 h-32 bg-[#F5DFB5] flex flex-col items-start justify-center rounded-lg shadow-lg relative p-4">
            <span className="absolute top-2 text-outline text-lg">To-Do</span>
            <div className="text-gray-600 mt-8 font-semibold text-[40px]">
              {summary?.[0]?.todo ?? "Not Started"}
            </div>
          </div>

          {/* In Progress Box */}
          <div className="w-1/2 h-32 bg-[#F5DFB5] flex flex-col items-start justify-center rounded-lg shadow-lg relative p-4">
            <span className="absolute top-2 text-outline text-lg">
              In Progress
            </span>
            <div className="text-gray-600 mt-8 font-semibold text-[40px]">
              {summary?.[0]?.inprogress ?? "Not Started"}
            </div>
          </div>

          {/* Completed Box */}
          <div className="w-1/2 h-32 bg-[#F5DFB5] flex flex-col items-start justify-center rounded-lg shadow-lg relative p-4">
            <span className="absolute top-2 text-outline text-lg">
              Completed
            </span>
            <div className="text-gray-600 mt-8 font-semibold text-[40px]">
              {summary?.[0]?.completed ?? "Not Started"}
            </div>
          </div>

          {/* What Went Wrong Box */}
          <div className="w-1/2 h-32 bg-[#F5DFB5] flex flex-col items-start justify-center rounded-lg shadow-lg relative p-4">
            <span className="absolute top-2 text-outline text-lg mb-4">
              Note
            </span>
            {isEditing ? (
              <textarea
                value={content}
                onChange={handleChange}
                autoFocus
                className="text-gray-700 bg-transparent w-full outline-none mt-6"
              />
            ) : (
              <p className="text-gray-700 mt-8">
                {content || "Please Input Note."}
              </p>
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
                  disabled={isDisable}
                  className={`${isDisable ? "text-gray-500":"text-[#171717] "} px-2 py-2 rounded-full flex items-center ${isDisable? "" : "hover:bg-gray-300"}  transition`}
                >
                  <FontAwesomeIcon icon={faPenToSquare} className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </ResponsiveContainer>
    );
  }
);

export default Summary;
