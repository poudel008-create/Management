import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Bell } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/authContext";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../services/notificationService";
import {
  relativeTime,
  typeIcon,
  notifText,
  navigateToNotif,
} from "../utils/notificationHelpers";
import { closeNotificationsPage } from "../utils/notificationNav";

const dispatchChanged = () =>
  window.dispatchEvent(new CustomEvent("notifications:changed"));

const NotificationDropdown = ({ unreadCount, setUnreadCount }) => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const panelRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const onNotifPage = location.pathname === "/notifications";

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Reopen the dropdown when we come back from the full page ("Show less").
  // This effect must stay AFTER the "close on route change" effect above.
  useEffect(() => {
    if (location.state?.openNotifications) {
      setOpen(true);

      // Clear the flag so it does not reopen on refresh or later navigation
      navigate(location.pathname + location.search, {
        replace: true,
        state: null,
      });
    }
  }, [location.key]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Fetch list when panel opens
  useEffect(() => {
    if (!open || !token) return;

    const fetchList = async () => {
      setLoading(true);
      try {
        const data = await getNotifications(token);
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount ?? 0);
      } catch {
        toast.error("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [open, token]);

  const handleBellClick = () => {
    // On the full page the bell works like "Show less"
    if (onNotifPage) {
      closeNotificationsPage(navigate, location, user?.role);
      return;
    }

    setOpen((v) => !v);
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead(token);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      dispatchChanged();
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  const handleRowClick = async (n) => {
    // Optimistic read
    if (!n.read) {
      setNotifications((prev) =>
        prev.map((x) => (x._id === n._id ? { ...x, read: true } : x))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
      dispatchChanged();

      try {
        await markNotificationRead(n._id, token);
      } catch {
        // revert
        setNotifications((prev) =>
          prev.map((x) => (x._id === n._id ? { ...x, read: false } : x))
        );
        setUnreadCount((c) => c + 1);
        dispatchChanged();
      }
    }

    setOpen(false);
    navigateToNotif(n, navigate, location.pathname);
  };

  const preview = notifications.slice(0, 8);

  return (
    <div className="relative" ref={panelRef}>

      {/* Bell button */}
      <button
        onClick={handleBellClick}
        className={`relative p-2 rounded-lg transition ${
          open || onNotifPage
            ? "bg-indigo-50 text-indigo-600"
            : "text-slate-500 hover:bg-slate-100"
        }`}
        aria-label="Notifications"
      >
        <Bell size={20} />

        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-4 h-4 px-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl border border-slate-200 shadow-xl z-50 flex flex-col overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <span className="font-bold text-slate-800">
              Notifications
            </span>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Body */}
          <div className="overflow-y-auto max-h-96">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-7 h-7 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
              </div>
            ) : preview.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-400 flex items-center justify-center mb-2">
                  <Bell size={20} />
                </div>

                <p className="text-sm font-semibold text-slate-700">
                  No notifications yet
                </p>

                <p className="text-xs text-slate-400 mt-0.5">
                  You're all caught up!
                </p>
              </div>
            ) : (
              preview.map((n) => (
                <button
                  key={n._id}
                  onClick={() => handleRowClick(n)}
                  className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-slate-50 transition border-b border-slate-50 last:border-b-0 ${
                    !n.read ? "bg-indigo-50/40" : ""
                  }`}
                >
                  {/* Avatar + icon */}
                  <div className="relative shrink-0 mt-0.5">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                      {n.sender?.name?.charAt(0).toUpperCase() || "?"}
                    </div>

                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center border border-slate-100">
                      {typeIcon(n.type, 9)}
                    </span>
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-700 leading-snug line-clamp-2">
                      {notifText(n)}
                    </p>

                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {relativeTime(n.createdAt)}
                    </p>
                  </div>

                  {/* Unread dot */}
                  {!n.read && (
                    <span className="shrink-0 mt-1.5 w-2 h-2 rounded-full bg-indigo-500" />
                  )}
                </button>
              ))
            )}
          </div>

          {/* Footer: remembers the page we came from */}
          <div className="border-t border-slate-100 px-4 py-2.5">
            <Link
              to="/notifications"
              state={{ from: location.pathname + location.search }}
              onClick={() => setOpen(false)}
              className="block text-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition"
            >
              View all notifications
            </Link>
          </div>

        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;