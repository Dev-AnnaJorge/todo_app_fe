import React, { useEffect, useState } from "react";
import { User } from "@/interfaces/Users";
import axios from "axios";
import toast from "react-hot-toast";

interface EditClientInfoModalProps {
  clientInfo: User;
  closeModal: () => void;
  onSuccess: () => void;
}

const EditClientInfoModal: React.FC<EditClientInfoModalProps> = ({
  clientInfo,
  closeModal,
  onSuccess,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: clientInfo.firstName || "",
    lastName: clientInfo.lastName || "",
    nickname: clientInfo.nickname || "",
    username: clientInfo.username || "",
    contactNo: clientInfo.contactNo || "",
    birthDate: clientInfo.birthDate || "",
  });

  useEffect(() => {
    if (clientInfo) {
      setFormData({
        firstName: clientInfo.firstName,
        lastName: clientInfo.lastName,
        nickname: clientInfo.nickname,
        username: clientInfo.username,
        contactNo: clientInfo.contactNo,
        birthDate: clientInfo.birthDate,
      });
    }
  }, [clientInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedData = {
        username: formData.username,
        password: clientInfo.password, 
        firstName: formData.firstName,
        middleName: clientInfo.middleName || "", 
        lastName: formData.lastName,
        suffix: clientInfo.suffix || "",
        contactNo: formData.contactNo || "",
        userRole: clientInfo.userRole || "client",
        birthDate: formData.birthDate,
      };
  
      await axios.put(
        `http://localhost:3001/api/user/update/${clientInfo.userId}`,
        updatedData
      );
      setFormData((prev) => ({
        ...prev,
        ...updatedData, 
      }));
      
      toast.success("Client info updated successfully!");
      onSuccess();
      closeModal();
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update client info.");
      console.error(error);
    }
  };
  

  const handleCancel = () => {
    setFormData({
      firstName: clientInfo.firstName,
      lastName: clientInfo.lastName,
      nickname: clientInfo.nickname,
      username: clientInfo.username,
      contactNo: clientInfo.contactNo,
      birthDate: clientInfo.birthDate,
    });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
        <button
          onClick={closeModal}
           className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl"
        >
          x
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">Client Information</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              readOnly={!isEditing}
              className="w-full border p-2 rounded bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              readOnly={!isEditing}
              className="w-full border p-2 rounded bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Nickname</label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              readOnly={!isEditing}
              className="w-full border p-2 rounded bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              readOnly={!isEditing}
              className="w-full border p-2 rounded bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Contact No</label>
            <input
              type="text"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
              readOnly={!isEditing}
              className="w-full border p-2 rounded bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Birthdate</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              readOnly={!isEditing}
              className="w-full border p-2 rounded bg-white"
            />
          </div>

          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="w-full py-2 bg-[#F5DFB5] text-gray-500 rounded mt-4"
            >
              Edit Info
            </button>
          ) : (
            <div className="flex gap-2 mt-4">
              <button
                type="submit"
                className="w-full py-2 bg-[#DCEDC1] text-gray-600 rounded"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="w-full py-2 bg-red-200 text-gray-600 rounded"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditClientInfoModal;
