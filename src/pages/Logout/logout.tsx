import { useState } from "react";
import Image from "next/image";
import { MenuIcon, UserCircle } from "lucide-react";
import { useRouter } from "next/router";
import fetchStore from "@/stores/fetchStore";
import { observer } from "mobx-react-lite";

interface LogoutProps {
  onSelectMenu: (menu: string) => void;
  activeMenu: string;
}

const Logout: React.FC<LogoutProps> = ({ onSelectMenu, activeMenu }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const router = useRouter();


  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center p-4 shadow bg-[#F5E8E8]">
        <div className="flex items-center gap-2">
          <Image
            src="/Images/taskTracker2.0.png"
            alt="Task Tracker Logo"
            width={100}
            height={100}
          />
        </div>
        <div className="flex items-center gap-8 mr-20 ">
          <div className="relative inline-block text-left">
            <button
              onClick={toggleMenu}
              className="flex items-center gap-2 border p-2"
            >
              <MenuIcon size={20} className="text-gray-600 hover:bg-gray-200" />
              <UserCircle size={24} className="text-gray-600" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg w-40 z-10">
                <div className="py-1">
                  <a
                    href="#"
                    onClick={() => {
                      router.push("/login/TaskTrackerLogin");
                      setMenuOpen(false);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-100"
                  >
                    Sign in
                  </a>
                  <a
                    href="#"
                    onClick={() => {
                      router.push("/login/TaskTrackerSignUp");
                      setMenuOpen(false);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-100"
                  >
                    Sign up
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-[45px] font-bold text-red-400">
          You are not logged in,
        </h1>
        <p className="text-gray-600 mt-2">kindly login first.</p>
        <Image
            src="/Images/logout.png"
            alt="Task Tracker Logo"
            width={600}
            height={600}
          />
      </div>
    </div>
  );
};

export default observer(Logout);
