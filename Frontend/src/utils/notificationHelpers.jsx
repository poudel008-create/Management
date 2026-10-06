import {
  Heart,
  MessageCircle,
  FileText,
  UserPlus,
  CheckCircle,
  XCircle,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

export const relativeTime = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const typeIcon = (type, size = 12) => {
  if (type === "like") return <Heart size={size} className="text-red-400" />;
  if (type === "comment") return <MessageCircle size={size} className="text-indigo-400" />;
  if (type === "new_user") return <UserPlus size={size} className="text-green-500" />;
  if (type === "blog_approved") return <CheckCircle size={size} className="text-green-500" />;
  if (type === "blog_rejected") return <XCircle size={size} className="text-red-400" />;
  if (type === "blog_removed") return <Trash2 size={size} className="text-red-400" />;
  return <FileText size={size} className="text-slate-400" />;
};

export const notifText = (n) => {
  const name = n.sender?.name || "Someone";
  const title = n.blog?.title || "a blog";

  if (n.type === "like")
    return <span><b>{name}</b> liked your blog <b>{title}</b></span>;
  if (n.type === "comment")
    return <span><b>{name}</b> commented on your blog <b>{title}</b></span>;
  if (n.type === "new_user")
    return <span><b>{name}</b> joined as a {n.sender?.role || "user"}</span>;
  if (n.type === "blog_approved")
    return <span>Your blog <b>{title}</b> was <b className="text-green-600">approved</b></span>;
  if (n.type === "blog_rejected")
    return <span>Your blog <b>{title}</b> was <b className="text-red-500">rejected</b></span>;
  if (n.type === "blog_removed")
    return (
      <span>
        Admin <b>{name}</b> removed your blog{" "}
        <b>{n.blogTitle || "a blog"}</b>
      </span>
    );

  return <span><b>{name}</b> published a new blog <b>{title}</b></span>;
};

// Navigate after clicking a notification. fromPath = current pathname.
export const navigateToNotif = (n, navigate, fromPath) => {
  if (n.type === "new_user") {
    navigate("/admin/users");
    return;
  }

  // The blog no longer exists, so open the author's own blog list instead
  if (n.type === "blog_removed") {
    navigate("/user/my-blogs");
    return;
  }

  if (!n.blog?._id) {
    toast.error("This blog is no longer available");
    return;
  }

  navigate(`/blogs/${n.blog._id}`, { state: { from: fromPath } });
};