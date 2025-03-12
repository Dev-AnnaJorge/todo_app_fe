import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
import fetchStore from "@/stores/fetchStore";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const TaskTrackerSignup = observer(() => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
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
  const [showConfirmPassword, setShowConfirmPassword] =useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
  
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
      userRole: formData.userRole || undefined,
      birthDate: formData.birthDate,
    };
  
    await fetchStore.signup(payload);
  
    if (!fetchStore.error) {
      toast.success("User successfully added!");
      setFormData({
        username: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        middleName: "",
        lastName: "",
        suffix: "",
        nickname: "",
        contactNo: "",
        userRole: "client",
        birthDate: "",
      });
    } else {
      toast.error(fetchStore.error);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen px-4 relative ">
      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-2xl overflow-hidden max-w-4xl w-full border border-pink-200">
        <div className="flex flex-col items-center justify-center bg-[#F5DFB5] md:w-1/2 p-6">
          <p className="text-[20px] text-center mb-4 text-gray-600">
            Let's get Started!
          </p>
          <Image
            src="/Images/taskTracker2.0.png"
            alt="Task Tracker Logo"
            width={250}
            height={250}
            className="max-w-full md:w-[350px] md:h-[230px]"
          />
        </div>

        {/* Right Section - Signup Form */}
        <div className="flex z-10 flex-col justify-center md:w-1/2 p-8 ">
          <h2 className="text-lg sm:text-lg md:text-2xl font-semibold text-center mb-4 text-gray-600">
            Sign Up
          </h2>
          <p className="text-sm text-center mb-6 text-gray-600">
            Create an account to manage your tasks efficiently.
          </p>

          <form className="space-y-4 " onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 text-[11.8px] sm:text-[11.8px] md:text-[15px]">
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
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                autoComplete="off"
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
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className={buttonClasses}>
              {fetchStore.loading ? "Signing Up..." : "Sign Up"}
            </button>
            {/* {fetchStore.error && (
              <p className="text-red-500 text-sm">{fetchStore.error}</p>
            )} */}
          </form>

          <p className="mt-4 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <a
              href="/login/TaskTrackerLogin"
              className="text-yellow-600 hover:underline"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
});

export default TaskTrackerSignup;

// Tailwind Utility Classes
const inputClasses =
  "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500 text-[#444444]";
const buttonClasses =
  "w-full py-3 text-[#444444] font-bold rounded-full  border-gray-600 hover:text-white hover:bg-gradient-to-r from-[#f4b93e] to-[#f7693c] transition-colors ";
