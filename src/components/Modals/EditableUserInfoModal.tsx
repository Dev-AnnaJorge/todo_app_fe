import React, { useEffect, useState } from "react";
import { User } from "@/interfaces/Users";
import axios from "axios";
import toast from "react-hot-toast";
import { Eye, EyeOff, LogOut } from "lucide-react";
import fetchStore from "@/stores/fetchStore";
import router from "next/router";
import logout from "@/pages/Logout/logout";

interface EditAdminInfoModalProps {
  UserInfo: User;
  closeModal: () => void;
  onSuccess: () => void;
}

const EditableUserInfoModal: React.FC<EditAdminInfoModalProps> = ({
  UserInfo,
  closeModal,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
  });

  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [visibility, setVisibility] = useState({
    showPassword: false,
    showConfirmPassword: false,
  });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    if (UserInfo) {
      setFormData({
        firstName: UserInfo.firstName,
        lastName: UserInfo.lastName,
        username: UserInfo.username,
      });
    }
  }, [UserInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetPassword = async () => {
    const { newPassword, confirmPassword } = passwords;

    if (!newPassword || newPassword !== confirmPassword) {
      toast.error("Passwords do not match or are empty!");
      return;
    }

    try {
      await axios.put(
        `${process.env.API_URL}/api/user/reset-password/${UserInfo.userId}`,
        { password: newPassword }
      );

      toast.success("Password reset successfully!");
      setShowPasswordFields(false);
      setPasswords({ newPassword: "", confirmPassword: "" });
      handleLogout();
      closeModal();
    } catch (error) {
      toast.error("Failed to reset password.");
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    fetchStore.logout();
    router.push("/tasks");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative shadow-lg">
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-center text-[#444444]">
          User's Information
        </h2>
        <form className="space-y-4 text-[#444444]">
          {Object.entries(formData).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium capitalize">
                {key.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type="text"
                value={value}
                readOnly
                className="w-full border p-2 rounded bg-white"
              />
            </div>
          ))}
          {!showPasswordFields ? (
            <button
              type="button"
              onClick={() => setShowPasswordFields(true)}
              className="w-full py-2 bg-[#C1E1EC] text-gray-600 rounded mt-4"
            >
              Reset Password
            </button>
          ) : (
            <>
              {(["newPassword", "confirmPassword"] as const).map((field) => (
                <div key={field} className="relative mt-2">
                  <input
                    type={
                      visibility[
                        field === "newPassword"
                          ? "showPassword"
                          : "showConfirmPassword"
                      ]
                        ? "text"
                        : "password"
                    }
                    name={field}
                    placeholder={
                      field === "newPassword"
                        ? "New Password"
                        : "Confirm Password"
                    }
                    value={passwords[field]}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setVisibility((prev) => ({
                        ...prev,
                        [field === "newPassword"
                          ? "showPassword"
                          : "showConfirmPassword"]:
                          !prev[
                            field === "newPassword"
                              ? "showPassword"
                              : "showConfirmPassword"
                          ],
                      }))
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {visibility[
                      field === "newPassword"
                        ? "showPassword"
                        : "showConfirmPassword"
                    ] ? (
                      <Eye size={20} />
                    ) : (
                      <EyeOff size={20} />
                    )}
                  </button>
                </div>
              ))}
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  className="w-full py-2 bg-[#DCEDC1] text-gray-600 rounded"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordFields(false)}
                  className="w-full py-2 bg-red-200 text-gray-600 rounded"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </form>
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 rounded"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="mb-4 text-gray-600">Are you sure you want to logout?</p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 bg-red-400 text-white rounded"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showResetConfirm && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="mb-4">
              Are you sure you want to reset your password?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleResetPassword}
                className="px-4 py-2 bg-red-400 text-white rounded"
              >
                Yes
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableUserInfoModal;
