import React, { useEffect, useState } from "react";
import { User } from "@/interfaces/Users";
import toast from "react-hot-toast";
import { Eye, EyeOff, LogOut } from "lucide-react";
import fetchStore from "@/stores/fetchStore";
import router from "next/router";
import { ResetPasswordService } from "@/services/Login.service";

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
    firstName: UserInfo.firstName || "",
    lastName: UserInfo.lastName || "",
    username: UserInfo.username || "",
  });

  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
    if (name === "newPassword") setNewPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword !== confirmPassword) {
      toast.error("Passwords do not match or are empty!");
      return;
    }
    setShowConfirmModal(true); // Show confirmation modal
  };

  const confirmResetPassword = async () => {
    if (!UserInfo?.userId) {
      toast.error("User ID is missing!");
      return;
    }
  
    if (!newPassword.trim()) {
      toast.error("Password cannot be empty!");
      return;
    }
  
    try {
      console.log("Resetting password for userId:", UserInfo.userId);
  
      const res = await ResetPasswordService(
        fetchStore.resetPassword, // Ensure this is the correct API route
        UserInfo.userId,
        newPassword
      );
  
      console.log("Password reset response:", res);
      toast.success("Password reset successfully!");
  
      // Reset fields after successful reset
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordFields(false);
      setShowConfirmModal(false);
    } catch (error: any) {
      console.error("Password reset error:", error.response?.data || error.message);
      toast.error("Failed to reset password. Please try again.");
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
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
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
              <div className="relative mt-2">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={handleResetPassword}
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
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 rounded"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Confirm Password Reset
            </h2>
            <p className="text-gray-600 text-center mb-4">
              Are you sure you want to reset this password?
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={confirmResetPassword}
                className="bg-[#DCEDC1] text-gray-700 px-4 py-2 rounded"
              >
                Yes, Reset
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-red-200 text-gray-700 px-4 py-2 rounded"
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
