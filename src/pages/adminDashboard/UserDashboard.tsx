import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import {
  Pencil,
  ToggleLeft,
  ToggleRight,
  Plus,
  Trash2,
  LogOut,
  UserCircle,
  Menu,
} from "lucide-react";
import { User } from "@/interfaces/Users";
import AddUser from "@/components/Modals/AddUSer";
import EditAdminInfoModal from "@/components/Modals/EditAdminInfoModal";
import fetchStore from "@/stores/fetchStore";
import router from "next/router";
import EditClientInfoModal from "@/components/Modals/EditClientInfoModal";

const PAGE_SIZE = 10;

const UserDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [showAdminInfoModal, setShowAdminInfoModal] = useState(false);
  const [adminInfo, setAdminInfo] = useState<User | null>(null);
  const [clientInfo, setClientInfo] = useState<User | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/user/list");
      setUsers(response.data);
      setFilteredUsers(response.data);

      const localStorageUser = localStorage.getItem("user");
      const userJson = localStorageUser ? JSON.parse(localStorageUser) : null;
      const adminUser = response.data.find(
        (user: User) => user.userId === Number(userJson?.userId)
      );

      if (adminUser) {
        setAdminInfo(adminUser);
      } else {
        toast.error("Admin information not found.");
      }
    } catch (error) {
      toast.error("Failed to fetch users.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        (user.username.toLowerCase().includes(search.toLowerCase()) ||
          user.firstName.toLowerCase().includes(search.toLowerCase()) ||
          user.lastName.toLowerCase().includes(search.toLowerCase())) &&
        (roleFilter ? user.userRole === roleFilter : true)
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [search, roleFilter, users]);

  const toggleStatus = async (userId: number, currentStatus: boolean) => {
    try {
      await axios.put(
        `http://localhost:3001/api/user/update/${userId}/${!currentStatus}`
      );
      toast.success("User status updated!");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update status.");
      console.error(error);
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setClientInfo(user);
    setShowEditModal(true);
  };

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const deleteUser = async () => {
    if (!userToDelete) return;
    try {
      await axios.delete(
        `http://localhost:3001/api/user/delete/${userToDelete.userId}`
      );
      toast.success("User deleted successfully!");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user.");
      console.error(error);
    } finally {
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    fetchStore.logout();
    router.push("/tasks");
  };

  return (
    <div className="p-2 md:p-6">
      <nav className="w-full flex justify-between items-center pb-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/Images/taskTracker2.0.png"
            alt="Task Tracker Logo"
            width={120}
            height={120}
            className="md:w-[130px] md:h-[90px]"
          />
        </div>

        {/* Title */}
        <h1 className="text-lg md:text-2xl font-semibold text-[#444444] text-center md:text-left">
          User Management Dashboard
        </h1>

        {/* Buttons */}
        <div className="relative flex items-center gap-2">
          {/* Desktop buttons */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setShowAdminInfoModal(true)}
              className="flex items-center bg-transparent text-gray-700 px-1 py-1 rounded"
            >
              <UserCircle size={24} />
            </button>
            <button
               onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center bg-transparent text-red-600 px-1 py-1 rounded"
            >
              <LogOut size={18} />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center bg-transparent text-gray-700 px-1 py-1 rounded"
            >
              <Menu size={24} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg w-40 z-[99999]">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setMenuOpen(false); // Close menu first
                      setShowAdminInfoModal(true); // Open modal slightly after
                    }}
                    className="flex gap-6 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Admin Info
                    <UserCircle size={24} />
                  </button>
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="flex gap-14 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                    <LogOut size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by name or username"
            className="border p-1 w-full md:w-[300px] rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="border p-2 rounded w-full md:w-auto"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="client">Client</option>
          </select>
        </div>

        <button
          onClick={() => setShowRegisterModal(true)}
          className="flex items-center gap-2 justify-center bg-[#F5DFB5] text-gray-600 px-4 py-2 rounded"
        >
          <Plus size={16} /> Add User
        </button>
      </div>

      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <AddUser
            closeModal={() => setShowRegisterModal(false)}
            onSuccess={fetchUsers}
          />
        </div>
      )}
      {/* User Table with Horizontal Scroll */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg text-[#444444] text-sm sm:text-sm md:text-base">
          <thead>
            <tr className="bg-[#F5E8E8] text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Username</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.userId} className="border-t">
                <td className="p-3">
                  {user.firstName} {user.middleName} {user.lastName}
                </td>
                <td className="p-3">{user.username}</td>
                <td className="p-3 capitalize">{user.userRole}</td>
                <td className="p-3">
                  <button
                    onClick={() => toggleStatus(user.userId, user.isActive)}
                    className={`flex items-center ${
                      user.userRole === "admin" ? "cursor-not-allowed" : ""
                    }`}
                    disabled={user.userRole === "admin"}
                  >
                    {user.isActive ? (
                      <ToggleRight className="w-5 h-5 text-green-500" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-red-500" />
                    )}
                  </button>
                </td>
                <td className="p-3 flex gap-2">
                  {user.userRole !== "admin" && (
                    <button
                      onClick={() => openEditModal(user)}
                      className="p-1 rounded"
                    >
                      <Pencil className="w-4 h-4 text-blue-600" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <p className="text-center p-4">No users found.</p>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        {Array.from({
          length: Math.ceil(filteredUsers.length / PAGE_SIZE),
        }).map((_, idx) => (
          <button
            key={idx}
            className={`px-3 py-1 rounded ${
              currentPage === idx + 1
                ? "bg-[#F5DFB5] text-[#444444]"
                : "bg-gray-200"
            }`}
            onClick={() => setCurrentPage(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
      </div>
      {showAdminInfoModal && adminInfo && (
        <EditAdminInfoModal
          adminInfo={adminInfo}
          closeModal={() => setShowAdminInfoModal(false)}
          onSuccess={fetchUsers}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Edit {selectedUser.username}
            </h2>
            {showEditModal && selectedUser && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <EditClientInfoModal
                  clientInfo={selectedUser}
                  closeModal={() => setShowEditModal(false)}
                  onSuccess={fetchUsers}
                />
              </div>
            )}
            <button
              className="mt-4 px-4 py-2 bg-red-200"
              onClick={() => setShowEditModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="mb-4">Are you sure you want to logout?</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleLogout}
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

export default UserDashboard;
