import React, { useEffect, useRef, useState } from "react";
import TaskInput from "../ToDo/TaskInput";
import Image from "next/image";
import { Menu, UserCircle, X } from "lucide-react";
import { useRouter } from "next/router";
import fetchStore from "@/stores/fetchStore";
import { observer } from "mobx-react-lite";
import EditableUserInfoModal from "../Modals/EditableUserInfoModal";

interface NavBarProps {
  onSelectMenu: (menu: string) => void;
  activeMenu: string;
}

const NavBar: React.FC<NavBarProps> = ({ onSelectMenu, activeMenu }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    fetchStore.logout();
    router.push("/tasks");
  };

  const userName = fetchStore.user?.nickname || fetchStore.user?.firstName;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 flex flex-col sm:flex-row justify-between items-center bg-[#F5E8E8] p-4 sm:p-0 shadow-md ">
        {/* Left Section */}
        <div className="flex justify-between items-center w-full sm:w-auto px-2 sm:px-10">
          <div className="flex items-center gap-2">
            <Image
              src="/Images/taskTracker2.0.png"
              alt="Task Tracker Logo"
              width={70}
              height={70}
              className="sm:w-[140px] sm:h-[140px] md:w-[120px] md:h-[85px]"
            />
            <span className="text-gray-700 text-[14px] sm:text-[16px]">
              Hi! {userName}
            </span>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="sm:hidden" onClick={() => setNavOpen(!navOpen)}>
            {navOpen ? <X size={24} /> : <Menu size={20} />}
          </button>
        </div>

        <div className="hidden sm:flex flex-grow justify-center">
          <TaskInput onAddTask={() => {}} />
        </div>

        {/* Right Menu */}
        <div className="hidden sm:flex items-center mr-12 relative">
          {/* Menu Dropdown */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 border rounded-md"
          >
            <Menu size={20} className="text-gray-600" />
          </button>
          {menuOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-12 top-12 bg-white border rounded-lg shadow-lg w-40 z-50"
            >
              <a
                href="#"
                onClick={() => {
                  onSelectMenu("dailyList");
                  setMenuOpen(false);
                }}
                className={`block px-4 py-2 text-sm ${
                  activeMenu === "dailyList" ? "bg-[#F5DFB5]" : "text-gray-700"
                } hover:bg-yellow-100`}
              >
                Daily Lists
              </a>
              <a
                href="#"
                onClick={() => {
                  onSelectMenu("tasksOverview");
                  setMenuOpen(false);
                }}
                className={`block px-4 py-2 text-sm ${
                  activeMenu === "tasksOverview"
                    ? "bg-[#F5DFB5]"
                    : "text-gray-700"
                } hover:bg-yellow-100`}
              >
                Tasks Overview
              </a>
            </div>
          )}

          {/* User Modal */}
          <button
            onClick={() => setUserModalOpen(true)}
            className="p-2 border rounded-md"
          >
            <UserCircle size={24} className="text-gray-600" />
          </button>
          {userModalOpen && (
            <div
              ref={modalRef}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            >
            </div>
          )}
        </div>
      </header>

      {/* Mobile Dropdown Menu */}
      {navOpen && (
        <div className="sticky top-16 z-50 flex flex-col gap-4 bg-white p-4 shadow-md">
          <TaskInput onAddTask={() => {}} />
          <nav className="flex flex-col gap-2">
            <a
              href="#"
              onClick={() => {
                onSelectMenu("dailyList");
                setNavOpen(false);
              }}
              className="text-gray-700 text-sm py-2 px-4 rounded hover:bg-gray-100"
            >
              Daily Lists
            </a>
            <a
              href="#"
              onClick={() => {
                onSelectMenu("tasksOverview");
                setNavOpen(false);
              }}
              className="text-gray-700 text-sm py-2 px-4 rounded hover:bg-gray-100"
            >
              Tasks Overview
            </a>
            <button
              onClick={() => setUserModalOpen(true)}
              className="text-gray-700 text-sm py-2 px-4 rounded hover:bg-gray-100 text-left"
            >
              User Profile
            </button>
          </nav>
        </div>
      )}

      {/* User Modal for Mobile & Desktop */}
      {userModalOpen && fetchStore.user && (
        <EditableUserInfoModal
          UserInfo={fetchStore.user}
          closeModal={() => setUserModalOpen(false)}
          onSuccess={() => console.log("User info updated successfully")}
        />
      )}
    </>
  );
};

export default observer(NavBar);
