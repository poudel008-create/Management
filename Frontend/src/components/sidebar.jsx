import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  ChevronDown,
  Heart,
  Bookmark,
  ClipboardCheck,
} from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const role = user?.role;

  const blogsChildPaths = ["/blogs", "/blogs/liked", "/blogs/saved", "/blogs/my"];
  const isBlogsActive =
    location.pathname === "/blogs" ||
    (location.pathname.startsWith("/blogs/") &&
      !["/blogs/liked", "/blogs/saved", "/blogs/my"].includes(location.pathname) === false
        ? false
        : blogsChildPaths.some((p) => location.pathname === p));

  const isBlogsGroupActive =
    blogsChildPaths.some((p) => location.pathname === p) ||
    (location.pathname.startsWith("/blogs/") &&
      !["/blogs/liked", "/blogs/saved", "/blogs/my"].includes(location.pathname));

  const [blogsOpen, setBlogsOpen] = useState(false);

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
        name: "Review Queue",
        path: "/review",
        icon: ClipboardCheck,
      },
      {
        name: "Profile",
        path: "/admin/profile",
        icon: User,
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
        name: "Review Queue",
        path: "/review",
        icon: ClipboardCheck,
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

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">

          {items.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-indigo-500/25 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </button>
            );
          })}

          {/* Blogs Dropdown */}
          <div>
            <button
              onClick={() => setBlogsOpen((prev) => !prev)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isBlogsGroupActive
                  ? "text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <BookOpen size={19} />
              <span className="flex-1 text-left">Blogs</span>
              <ChevronDown
                size={15}
                className={`transition-transform duration-200 ${
                  blogsOpen || isBlogsGroupActive ? "rotate-180" : ""
                }`}
              />
            </button>

            {(blogsOpen || isBlogsGroupActive) && (
              <div className="ml-4 mt-1 space-y-1">

                {([
                  { path: "/blogs", label: "All Blogs", icon: BookOpen,
                    isActive: location.pathname === "/blogs" ||
                      (location.pathname.startsWith("/blogs/") &&
                        !["/blogs/liked", "/blogs/saved", "/blogs/my"].includes(location.pathname)) },
                  { path: "/blogs/liked", label: "Liked Blogs", icon: Heart,
                    isActive: location.pathname === "/blogs/liked" },
                  { path: "/blogs/saved", label: "Saved Blogs", icon: Bookmark,
                    isActive: location.pathname === "/blogs/saved" },
                ]).map(({ path, label, icon: Icon, isActive }) => (
                  <button
                    key={path}
                    onClick={() => handleNavigation(path)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition text-sm ${
                      isActive
                        ? "bg-indigo-500/25 text-white"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                  </button>
                ))}

                {role === "student" && (
                  <button
                    onClick={() => handleNavigation("/blogs/my")}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition text-sm ${
                      location.pathname === "/blogs/my"
                        ? "bg-indigo-500/15 text-indigo-300"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <FileText size={16} />
                    <span>My Blogs</span>
                  </button>
                )}

              </div>
            )}
          </div>

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