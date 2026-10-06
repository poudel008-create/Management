import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardCheck, ImageOff, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/authContext";
import { getReviewBlogs, approveBlog, rejectBlog } from "../services/blogService";

const ReviewQueue = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";
  const userId = (user?._id || user?.id)?.toString();

  const [tab, setTab] = useState("pending");
  const [rows, setRows] = useState([]);
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(null); // id being acted on

  const [rejectTarget, setRejectTarget] = useState(null); // { id, title }
  const [rejectReason, setRejectReason] = useState("");
  const [rejecting, setRejecting] = useState(false);

  const fetchTab = async (status) => {
    setLoading(true);
    try {
      const data = await getReviewBlogs(status, token);
      setRows(data.blogs || []);
      if (data.counts) setCounts(data.counts);
    } catch {
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchTab(tab);
  }, [tab, token]);

  const handleApprove = async (blog) => {
    setActing(blog._id);
    try {
      await approveBlog(blog._id, token);
      setRows((prev) => prev.filter((b) => b._id !== blog._id));
      setCounts((c) => ({
        ...c,
        pending: tab === "pending" ? Math.max(0, c.pending - 1) : c.pending,
        rejected: tab === "rejected" ? Math.max(0, c.rejected - 1) : c.rejected,
        approved: c.approved + 1,
      }));
      toast.success("Blog approved");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve");
      if (error.response?.status === 409) setRows((prev) => prev.filter((b) => b._id !== blog._id));
    } finally {
      setActing(null);
    }
  };

  const openReject = (blog) => {
    setRejectTarget({ id: blog._id, title: blog.title });
    setRejectReason("");
  };

  const handleReject = async () => {
    if (!rejectTarget || rejectReason.trim().length < 5) return;
    setRejecting(true);
    try {
      await rejectBlog(rejectTarget.id, rejectReason.trim(), token);
      setRows((prev) => prev.filter((b) => b._id !== rejectTarget.id));
      setCounts((c) => ({
        ...c,
        pending: tab === "pending" ? Math.max(0, c.pending - 1) : c.pending,
        approved: tab === "approved" ? Math.max(0, c.approved - 1) : c.approved,
        rejected: c.rejected + 1,
      }));
      toast.success("Blog rejected");
      setRejectTarget(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject");
      if (error.response?.status === 409) {
        setRows((prev) => prev.filter((b) => b._id !== rejectTarget.id));
        setRejectTarget(null);
      }
    } finally {
      setRejecting(false);
    }
  };

  const tabs = [
    { key: "pending", label: "Pending", count: counts.pending },
    { key: "approved", label: "Approved", count: counts.approved },
    { key: "rejected", label: "Rejected", count: counts.rejected },
  ];

  return (
    <div className="max-w-4xl mx-auto">

      {/* Header */}
      <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-6 sm:p-7 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white text-indigo-600 flex items-center justify-center border border-indigo-100">
            <ClipboardCheck size={22} />
          </div>
          <div>
            <p className="text-indigo-600 text-sm font-semibold uppercase tracking-wide">Review Queue</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-0.5">Blogs waiting for review</h1>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition ${
              tab === t.key
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {t.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
              tab === t.key ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"
            }`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      ) : rows.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <ClipboardCheck size={26} />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mt-5">Nothing to review</h2>
          <p className="text-slate-500 mt-2 text-sm">No {tab} blogs at the moment.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((blog) => {
            const reviewer = blog.reviewedBy?.name;
            const reviewerIdStr = blog.reviewedBy?._id?.toString();
            const canChange = isAdmin || reviewerIdStr === userId;
            // On pending tab everyone with access can act; on other tabs only if canChange
            const canAct = tab === "pending" || canChange;
            return (
              <div
                key={blog._id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm flex items-start gap-4 p-4 hover:border-indigo-200 transition"
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
                  {blog.image ? (
                    <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                  ) : (
                    <ImageOff size={20} className="text-slate-300" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 truncate">{blog.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-snug">{blog.content}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1.5 text-xs text-slate-400">
                    <span>{blog.author?.name || "Unknown"}</span>
                    <span>·</span>
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    {reviewer && (
                      <>
                        <span>·</span>
                        <span>
                          {tab === "approved" ? "Approved" : "Rejected"} by {reviewer}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => navigate(`/blogs/${blog._id}`, { state: { from: "/review" } })}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-100 transition"
                  >
                    View <ArrowRight size={12} />
                  </button>

                  {tab === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(blog)}
                        disabled={acting === blog._id}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs font-semibold hover:bg-green-100 transition disabled:opacity-50"
                      >
                        <CheckCircle size={12} /> Approve
                      </button>
                      <button
                        onClick={() => openReject(blog)}
                        disabled={acting === blog._id}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-100 transition disabled:opacity-50"
                      >
                        <XCircle size={12} /> Reject
                      </button>
                    </>
                  )}

                  {tab === "approved" && canChange && (
                    <button
                      onClick={() => openReject(blog)}
                      disabled={acting === blog._id}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-100 transition disabled:opacity-50"
                    >
                      <XCircle size={12} /> Reject
                    </button>
                  )}

                  {tab === "rejected" && canChange && (
                    <button
                      onClick={() => handleApprove(blog)}
                      disabled={acting === blog._id}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs font-semibold hover:bg-green-100 transition disabled:opacity-50"
                    >
                      <CheckCircle size={12} /> Approve
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject modal */}
      {rejectTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={(e) => e.target === e.currentTarget && setRejectTarget(null)}
        >
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-slate-800">Reject blog</h3>
            <p className="text-sm text-slate-500 mt-1 line-clamp-1">"{rejectTarget.title}"</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              maxLength={300}
              placeholder="Enter rejection reason (5–300 characters)..."
              className="mt-4 w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 resize-none outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
            />
            <div className="flex justify-between items-center mt-1">
              <span className={`text-xs ${
                rejectReason.trim().length < 5 || rejectReason.trim().length > 300
                  ? "text-red-400"
                  : "text-slate-400"
              }`}>
                {rejectReason.trim().length}/300
              </span>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setRejectTarget(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={rejecting || rejectReason.trim().length < 5 || rejectReason.trim().length > 300}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition disabled:opacity-50"
              >
                {rejecting ? "Rejecting..." : "Reject Blog"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ReviewQueue;
