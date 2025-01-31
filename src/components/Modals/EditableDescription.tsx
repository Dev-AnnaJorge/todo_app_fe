import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import RadioButton from "../Buttons/Radio";

interface EditableTaskProps {
  description: string;
  onSave: (newDescription: string) => void;
}

const EditableTask: React.FC<EditableTaskProps> = ({ description, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newDescription, setNewDescription] = useState(description);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewDescription(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onSave(newDescription);
  };

  return (
    <div className="bg-[#DAD7D7] p-5 rounded-lg">
      {isEditing ? (
        <textarea
          value={newDescription}
          onChange={handleChange}
          onBlur={handleBlur} // Saves and exits edit mode when user clicks away
          autoFocus
          className="text-gray-700 bg-transparent w-full outline-none"
        />
      ) : (
        <p className="text-gray-700 mt-2">{newDescription}</p>
      )}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleEditClick}
          className="text-[#171717] px-2 py-2 rounded flex items-center hover:bg-gray-300 transition"
        >
          <FontAwesomeIcon icon={faPenToSquare} className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default EditableTask;
