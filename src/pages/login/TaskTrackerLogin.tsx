import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
import fetchStore from "@/stores/fetchStore";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

const TaskTrackerLogin = observer(() => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetchStore.login(username, password);

    if (fetchStore.user) {
      const { userRole } = fetchStore.user;

      if (userRole === "admin") {
        router.push("/adminDashboard/UserDashboard");
      } else if (userRole === "client") {
        router.push("/dailylists/userDailyTasks");
      } else {
        toast.error("Unknown user role.");
      }
    } else {
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 relative">
      <div className="flex flex-col bg-white shadow-lg rounded-2xl overflow-hidden max-w-md w-full border border-pink-200">
        {/* Top Section - Logo & Title */}
        <div className="flex flex-col items-center justify-center p-6 bg-[#F5DFB5]">
          <Image
            src="/Images/taskTracker2.0.png"
            alt="Task Tracker Logo"
            width={500}
            height={500}
            className="max-w-full"
          />
        </div>

        {/* Bottom Section - Signup Form */}
        <div className="flex flex-col justify-center p-8">
          <h2 className="text-2xl font-semibold text-center mb-4 text-gray-600">
            Welcome back!
          </h2>
          <p className="text-sm text-center mb-6 text-gray-600">
            Let’s help you meet up with your tasks.
          </p>

          <form className="w-full space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-yellow-500 text-[#444444]"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="off"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-yellow-500 text-[#444444]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
            <div className="text-center">
              <p className="mt-4 text-sm">
                Don't have an account?{" "}
                <a
                  href="/login/TaskTrackerSignUp"
                  className="text-yellow-600 hover:underline"
                >
                  Sign Up
                </a>
              </p>
            </div>
            <button
              type="submit"
              className="w-full py-3 text-[#444444] font-bold rounded-full border-gray-600 hover:text-white hover:bg-gradient-to-r from-[#f4b93e] to-[#f7693c] transition-colors"
            >
              {fetchStore.loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
});

export default TaskTrackerLogin;
