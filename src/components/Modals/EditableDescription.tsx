import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faSave } from "@fortawesome/free-solid-svg-icons";
import { TaskProps } from "@/interfaces";
import RadioButton from "../Buttons/RadioButton";
// Import RadioButton component

interface EditableTaskProps {
  task: TaskProps;
  onSave: (newDescription: string, newCategory: string) => void;
  onClose: () => void;
}

const EditableTask: React.FC<EditableTaskProps> = ({ task, onSave, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newDescription, setNewDescription] = useState<string>(
    task.description
  );
  const [newCategory, setNewCategory] = useState<string>(task.category);

  useEffect(() => {
    setNewDescription(task.description);
    setNewCategory(task.category);
  }, [task]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  
  const handleSaveAllClick = () => {
    onSave(newDescription, newCategory);
    setIsEditing(false);
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewDescription(e.target.value);
  };

  const handleCategoryChange = (category: string) => {
    setNewCategory(category);
  };

  return (
    <div className="bg-[#EBEBEB]">
      <RadioButton task={task} onCategoryChange={handleCategoryChange} />
      <div className="bg-[#DAD7D7] p-5 rounded-lg h-[250px]">
        {isEditing ? (
          <>
            <textarea
              value={newDescription}
              onChange={handleChange}
              autoFocus
              className="text-gray-700 bg-transparent w-full outline-none h-[150px]"
            />
          </>
        ) : (
          <>
            <p className="text-gray-700 mt-2 h-[150px]">{newDescription}</p>
          </>
        )}
        <div className="flex justify-end mt-4">
          {task.status !== "completed" &&
            (isEditing ? (
              <button
                onClick={handleSaveAllClick}
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
            ))}
        </div>
      </div>
    </div>
  );
};

export default EditableTask;
