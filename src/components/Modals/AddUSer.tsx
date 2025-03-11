import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import fetchStore from "@/stores/fetchStore";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

const inputClasses =
  "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500 text-[#444444]";
const buttonClasses =
  "w-full py-3 text-[#444444] font-bold rounded-full border-gray-600 hover:text-white hover:bg-gradient-to-r from-[#f4b93e] to-[#f7693c] transition-colors";

interface AddUserProps {
  closeModal?: () => void;
  onSuccess?: () => void;
}

const AddUser: React.FC<AddUserProps> = observer(
  ({ closeModal, onSuccess }) => {
    const [formData, setFormData] = useState({
      username: "",
      password: "user123", // Default password
      firstName: "",
      middleName: "",
      lastName: "",
      suffix: "",
      nickname: "",
      contactNo: "",
      userRole: "client",
      birthDate: "",
    });

    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
      setFormData({
        username: "",
        password: "user123", // Default password
        firstName: "",
        middleName: "",
        lastName: "",
        suffix: "",
        nickname: "",
        contactNo: "",
        userRole: "client",
        birthDate: "",
      });
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      setError("");

      const payload = {
        username: formData.username,
        password: formData.password,
        firstName: formData.firstName,
        middleName: formData.middleName || undefined,
        lastName: formData.lastName,
        suffix: formData.suffix || undefined,
        nickname: formData.nickname || "",
        contactNo: formData.contactNo || undefined,
        userRole: formData.userRole,
        birthDate: formData.birthDate,
      };

      await fetchStore.signup(payload);
      if (!fetchStore.error) {
        toast.success("User successfully added!");
        resetForm();
        if (closeModal) {
          setTimeout(() => closeModal(), 1000); // 2 seconds delay
        }
        if (onSuccess) onSuccess();
      }
    };

    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="relative flex bg-white shadow-lg rounded-2xl overflow-hidden max-w-4xl w-full border border-pink-200 p-8">
          {closeModal && (
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
            >
              ×
            </button>
          )}

          <form
            className="space-y-4 w-full text-[15px]"
            onSubmit={handleSubmit}
          >
            <h2 className="text-2xl font-semibold text-center mb-4 text-gray-600">
              Register New User
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className={inputClasses}
                required
              />
              <input
                type="text"
                name="middleName"
                placeholder="Middle Name"
                value={formData.middleName}
                onChange={handleChange}
                className={inputClasses}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className={inputClasses}
                required
              />
              <input
                type="text"
                name="suffix"
                placeholder="Suffix (optional)"
                value={formData.suffix}
                onChange={handleChange}
                className={inputClasses}
              />
              <input
                type="text"
                name="nickname"
                placeholder="Nickname"
                value={formData.nickname}
                onChange={handleChange}
                className={inputClasses}
                required
              />
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className={inputClasses}
                required
              />
              <input
                type="text"
                name="contactNo"
                placeholder="Contact Number"
                value={formData.contactNo}
                onChange={handleChange}
                className={inputClasses}
                required
              />
              <select
                name="userRole"
                value={formData.userRole}
                onChange={handleChange}
                className={inputClasses}
                required
              >
                <option value="client">Client</option>
                <option value="admin">Admin</option>
              </select>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className={inputClasses}
                required
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className={buttonClasses}
              disabled={fetchStore.loading}
            >
              {fetchStore.loading ? "Adding User..." : "Add User"}
            </button>
          </form>
        </div>
      </div>
    );
  }
);

export default AddUser;
