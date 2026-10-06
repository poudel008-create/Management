import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Bell, Trash2, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/authContext";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "../services/notificationService";
import {
  relativeTime,
  typeIcon,
  notifText,
  navigateToNotif,
} from "../utils/notificationHelpers";
import { closeNotificationsPage } from "../utils/notificationNav";

const dispatch = () =>
  window.dispatchEvent(new CustomEvent("notifications:changed"));

const Notifications = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all"); // "all" | "unread"

  useEffect(() => {
    const fetchList = async () => {
      if (!token) return;

      try {
        const data = await getNotifications(token);
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      } catch {
        toast.error("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [token]);

  // Go back to the page we came from and reopen the small dropdown
  const showLess = () => {
    closeNotificationsPage(navigate, location, user?.role);
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead(token);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      dispatch();
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  const handleRead = async (n) => {
    // Optimistic
    if (!n.read) {
      setNotifications((prev) =>
        prev.map((x) => (x._id === n._id ? { ...x, read: true } : x))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
      dispatch();

      try {
        await markNotificationRead(n._id, token);
      } catch {
        // revert
        setNotifications((prev) =>
          prev.map((x) => (x._id === n._id ? { ...x, read: false } : x))
        );
        setUnreadCount((c) => c + 1);
        dispatch();
      }
    }

    navigateToNotif(n, navigate, location.pathname);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();

    const target = notifications.find((n) => n._id === id);

    // Optimistic removal
    setNotifications((prev) => prev.filter((n) => n._id !== id));

    if (target && !target.read) {
      setUnreadCount((c) => Math.max(0, c - 1));
    }

    dispatch();

    try {
      await deleteNotification(id, token);
    } catch {
      toast.error("Failed to delete notification");

      // revert
      setNotifications((prev) => [target, ...prev]);

      if (target && !target.read) setUnreadCount((c) => c + 1);

      dispatch();
    }
  };

  const visible =
    tab === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

        <div>
          <p className="text-indigo-600 text-sm font-semibold uppercase tracking-wide">
            Notifications
          </p>

          <h1 className="text-3xl font-bold text-slate-800 mt-1">
            Your notifications
          </h1>

          <p className="text-slate-500 mt-1 text-sm">
            {unreadCount > 0
              ? `${unreadCount} unread`
              : "You're all caught up"}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition shrink-0 mt-1"
          >
            Mark all as read
          </button>
        )}

      </div>


      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {["all", "unread"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition capitalize ${
              tab === t
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {t === "all" ? "All" : "Unread"}
          </button>
        ))}
      </div>


      {/* List */}
      {visible.length === 0 ? (

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">

          <div className="w-14 h-14 mx-auto rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Bell size={26} />
          </div>

          <h2 className="text-xl font-semibold text-slate-800 mt-5">
            {tab === "unread" ? "No unread notifications" : "No notifications yet"}
          </h2>

          <p className="text-slate-500 mt-2 text-sm">
            {user?.role === "student"
              ? "You'll be notified when someone likes or comments on your blogs."
              : user?.role === "admin"
              ? "You'll be notified when students publish blogs or new users join."
              : "You'll be notified when students publish new blogs."}
          </p>

        </div>

      ) : (

        <div className="space-y-2">
          {visible.map((n) => (
            <div
              key={n._id}
              onClick={() => handleRead(n)}
              className={`relative flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition group ${
                n.read
                  ? "bg-white border-slate-200 hover:border-indigo-300"
                  : "bg-indigo-50/40 border-slate-200 hover:border-indigo-300"
              }`}
            >

              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold">
                  {n.sender?.name?.charAt(0).toUpperCase() || "?"}
                </div>

                <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-white flex items-center justify-center border border-slate-100">
                  {typeIcon(n.type)}
                </span>
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 leading-snug">
                  {notifText(n)}
                </p>

                {n.type === "comment" && n.commentText && (
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    "{n.commentText}"
                  </p>
                )}

                {n.type === "blog_rejected" && n.commentText && (
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 italic">
                    {n.commentText}
                  </p>
                )}

                {n.type === "blog_removed" && n.commentText && (
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 italic">
                    Reason: {n.commentText}
                  </p>
                )}

                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-xs text-slate-400">
                    {relativeTime(n.createdAt)}
                  </span>
                </div>
              </div>

              {/* Unread dot */}
              {!n.read && (
                <span className="shrink-0 mt-1.5 w-2 h-2 rounded-full bg-indigo-500" />
              )}

              {/* Delete */}
              <button
                onClick={(e) => handleDelete(e, n._id)}
                className="shrink-0 p-1 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 transition opacity-0 group-hover:opacity-100"
                aria-label="Delete notification"
              >
                <Trash2 size={14} />
              </button>

            </div>
          ))}
        </div>

      )}


      {/* Show less: back to the previous page with the small dropdown open */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={showLess}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition"
        >
          <ChevronUp size={16} />
          Show less
        </button>
      </div>

    </div>
  );
};

export default Notifications;