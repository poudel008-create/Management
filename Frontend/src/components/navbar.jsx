import React from "react";
import { Menu, Bell } from "lucide-react";
import { useAuth } from "../context/authContext";

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6">

      {/* Left */}
      <div className="flex items-center gap-3">

        {/* Mobile Menu */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="font-bold text-slate-800 text-lg">
            {user?.role === "admin"
              ? "Admin Panel"
              : user?.role === "teacher"
              ? "Teacher Panel"
              : "Student Panel"}
          </h1>

          <p className="hidden sm:block text-xs text-slate-400">
            {user?.role === "admin"
              ? "Manage your application"
              : user?.role === "teacher"
              ? "Teacher portal"
              : "Student portal"}
          </p>
        </div>

      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

        <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100">
          <Bell size={20} />
        </button>

        <div className="hidden sm:flex items-center gap-3">

          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-700">
              {user?.name}
            </p>

            <p className="text-xs text-slate-400 capitalize">
              {user?.role}
            </p>
          </div>

        </div>

      </div>

    </header>
  );
};

export default Navbar;