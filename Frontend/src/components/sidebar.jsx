import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

import {
  LayoutDashboard,
  Users,
  BookOpen,
  UserCog,
  PenLine,
  FileText,
  GraduationCap,
  User,
  LogOut,
  X,
} from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const role = user?.role;

  const menuItems = {
    admin: [
      {
        name: "Dashboard",
        path: "/admin",
        icon: LayoutDashboard,
      },
      {
        name: "Users",
        path: "/admin/users",
        icon: Users,
      },
      {
        name: "Manage Roles",
        path: "/admin/roles",
        icon: UserCog,
      },
      {
        name: "Blogs",
        path: "/blogs",
        icon: BookOpen,
      },
    ],

    teacher: [
      {
        name: "Dashboard",
        path: "/teacher",
        icon: LayoutDashboard,
      },
      {
        name: "Students",
        path: "/teacher/students",
        icon: GraduationCap,
      },
      {
        name: "Blogs",
        path: "/blogs",
        icon: BookOpen,
      },
      {
        name: "Profile",
        path: "/teacher/profile",
        icon: User,
      },
    ],

    student: [
      {
        name: "Dashboard",
        path: "/user",
        icon: LayoutDashboard,
      },
      {
        name: "Create Blog",
        path: "/user/create-blog",
        icon: PenLine,
      },
      {
        name: "My Blogs",
        path: "/user/my-blogs",
        icon: FileText,
      },
      {
        name: "All Blogs",
        path: "/blogs",
        icon: BookOpen,
      },
      {
        name: "Profile",
        path: "/user/profile",
        icon: User,
      },
    ],
  };

  const items = menuItems[role] || [];

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      {/* Mobile Overlay */}

      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
        />
      )}


      {/* Sidebar */}

      <aside
        className={`
          fixed
          top-0
          left-0
          z-50
          w-64
          h-screen
          bg-slate-900
          text-white
          flex
          flex-col
          transition-transform
          duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >

        {/* Logo */}

        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">

          <div>

            <h2 className="text-xl font-bold">
              Dashboard
            </h2>

            <p className="text-xs text-slate-400 capitalize">
              {role} Portal
            </p>

          </div>


          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>

        </div>


        {/* Menu */}

        <nav className="flex-1 px-4 py-6 space-y-2">

          {items.map((item) => {

            const Icon = item.icon;

            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
              >

                <Icon size={19} />

                <span>
                  {item.name}
                </span>

              </button>
            );

          })}

        </nav>


        {/* Logout */}

        <div className="p-4 border-t border-slate-800">

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition"
          >

            <LogOut size={19} />

            <span>
              Logout
            </span>

          </button>

        </div>

      </aside>
    </>
  );
};

export default Sidebar;