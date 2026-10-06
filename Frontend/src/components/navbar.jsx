import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { useAuth } from "../context/authContext";
import { useLocation } from "react-router-dom";
import { getUnreadCount } from "../services/notificationService";
import NotificationDropdown from "../components/notificationDropdown";

const Navbar = ({ onMenuClick }) => {
  const { user, token } = useAuth();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchCount = async () => {
    if (!token) return;
    try {
      const data = await getUnreadCount(token);
      setUnreadCount(data.unreadCount || 0);
    } catch {
      // silent
    }
  };

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [token]);

  // Re-fetch when route changes or a notifications:changed event fires
  useEffect(() => { fetchCount(); }, [location.pathname]);

  useEffect(() => {
    const handler = () => fetchCount();
    window.addEventListener("notifications:changed", handler);
    return () => window.removeEventListener("notifications:changed", handler);
  }, [token]);

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

        <NotificationDropdown
            unreadCount={unreadCount}
            setUnreadCount={setUnreadCount}
          />

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