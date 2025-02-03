import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faSave } from "@fortawesome/free-solid-svg-icons";
import { TaskProps } from "@/interfaces";

interface EditableTaskProps {
  task: TaskProps;
  onSave: (newDescription: string) => void;
}

const EditableTask: React.FC<EditableTaskProps> = ({ task, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newDescription, setNewDescription] = useState<string>(task.description);

  useEffect(() => {
    setNewDescription(task.description);
  }, [task.description]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    onSave(newDescription);
    setIsEditing(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewDescription(e.target.value);
  };

  return (
    <div className="bg-[#DAD7D7] p-5 rounded-lg">
      {isEditing ? (
        <textarea
          value={newDescription}
          onChange={handleChange}
          autoFocus
          className="text-gray-700 bg-transparent w-full outline-none"
        />
      ) : (
        <p className="text-gray-700 mt-2">{newDescription}</p>
      )}
      <div className="flex justify-end mt-4">
        {task.status !== "completed" && (
          isEditing ? (
            <button
              onClick={handleSaveClick}
              className="text-[#171717] px-2 py-2 rounded flex items-center hover:bg-gray-300 transition"
            >
              <FontAwesomeIcon icon={faSave} className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={handleEditClick}
              className="text-[#171717] px-2 py-2 rounded flex items-center hover:bg-gray-300 transition"
            >
              <FontAwesomeIcon icon={faPenToSquare} className="h-5 w-5" />
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default EditableTask;
