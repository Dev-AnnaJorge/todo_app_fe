import React, { useEffect, useState } from "react";
import { User } from "@/interfaces/Users";
import axios from "axios";
import toast from "react-hot-toast";

interface EditAdminInfoModalProps {
  adminInfo: User;
  closeModal: () => void;
  onSuccess: () => void;
}

const EditAdminInfoModal: React.FC<EditAdminInfoModalProps> = ({
  adminInfo,
  closeModal,
  onSuccess,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: adminInfo.firstName || "",
    lastName: adminInfo.lastName || "",
    nickname: adminInfo.nickname || "",
    username: adminInfo.username || "",
    contactNo: adminInfo.contactNo || "",
    birthDate: adminInfo.birthDate || "",
  
  });

  useEffect(() => {
    if (adminInfo) {
      setFormData({
        firstName: adminInfo.firstName,
        lastName: adminInfo.lastName,
        nickname: adminInfo.nickname,
        username: adminInfo.username,
        contactNo: adminInfo.contactNo,
        birthDate: adminInfo.birthDate,
       
      });
    }
  }, [adminInfo]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        username: formData.username,
        password: adminInfo.password,
        firstName: formData.firstName,
        middleName: adminInfo.middleName,
        lastName: formData.lastName,
        suffix: adminInfo.suffix,
        nickname: formData.nickname,
        contactNo: formData.contactNo,
         userRole: adminInfo.userRole||"admin",
        birthDate: formData.birthDate,
        
      };
  
      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/update/${adminInfo.userId}`,
        payload
      );
      setFormData((prev) => ({
        ...prev,
        ...payload,
      }));

      toast.success("Admin info updated successfully!");
      onSuccess();
      closeModal();
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update admin info.");
      console.error(error);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: adminInfo.firstName,
      lastName: adminInfo.lastName,
      nickname: adminInfo.nickname,
      username: adminInfo.username,
      contactNo: adminInfo.contactNo,
      birthDate: adminInfo.birthDate,
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
        <h2 className="text-xl font-bold mb-4 text-center text-[#444444]">Admin Information</h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-[#444444]">
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

export default EditAdminInfoModal;
