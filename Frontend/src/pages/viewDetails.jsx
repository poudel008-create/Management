import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, CalendarDays, Heart, MessageCircle, Trash2, Bookmark, Clock, CheckCircle, XCircle, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import {
  getBlogById,
  toggleLike,
  addComment,
  deleteComment,
  toggleSave,
  getSavedBlogs,
  approveBlog,
  rejectBlog,
  deleteBlog,
  toggleCommentLike,
  toggleReplyLike,
  addReply,
  deleteReply,
} from "../services/blogService";
import { useAuth } from "../context/authContext";
import MuxPlayer from "@mux/mux-player-react";
import ConfirmDialog from "../components/confirmDialog";

const BlogDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const { token, user } = useAuth();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [liking, setLiking] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commenting, setCommenting] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState(null);
  const [deletingComment, setDeletingComment] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);
  const [openReplies, setOpenReplies] = useState({});
  const [showAllComments, setShowAllComments] = useState(false);
  const [deleteReplyTarget, setDeleteReplyTarget] = useState(null); // { commentId, replyId }

  // Admin: delete the whole blog
  const [deleteBlogOpen, setDeleteBlogOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [deletingBlog, setDeletingBlog] = useState(false);

  // Came from inside the app -> go back there, otherwise the blogs list
  const goBack = () => navigate(location.state?.from || "/blogs");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const [blogData, savedData] = await Promise.all([
          getBlogById(id, token),
          getSavedBlogs(token),
        ]);

        setBlog(blogData.blog);
        setLikeCount(blogData.blog.likes?.length || 0);
        setLiked(
          blogData.blog.likes?.some(
            (l) => (l._id || l).toString() === (user?._id || user?.id)?.toString()
          ) || false
        );
        setComments(blogData.blog.comments || []);

        const isSaved = savedData.blogs?.some(
          (b) => (b._id || b).toString() === id
        ) || false;
        setSaved(isSaved);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-slate-500">
            Loading blog...
          </p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-xl font-semibold text-slate-800">
          Blog not found
        </h2>

        <p className="text-slate-500 mt-2">
          This blog may have been deleted or the link is incorrect.
        </p>

        <button
          onClick={goBack}
          className="mt-5 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
        >
          <ArrowLeft size={17} />
          Go Back
        </button>
      </div>
    );
  }

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const data = await toggleSave(id, token);
      setSaved(data.saved);
      toast.success(data.saved ? "Saved to your reading list" : "Removed from saved blogs");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to save blog");
    } finally {
      setSaving(false);
    }
  };

  const handleLike = async () => {
    if (liking) return;
    setLiking(true);
    try {
      const data = await toggleLike(id, token);
      setLiked(data.liked);
      setLikeCount(data.likeCount);
    } catch (error) {
      console.log(error);
    } finally {
      setLiking(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || commenting) return;
    setCommenting(true);
    try {
      const data = await addComment(id, commentText, token);
      setComments((prev) => [...prev, data.comment]);
      setCommentText("");
      toast.success("Comment posted");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to post comment");
    } finally {
      setCommenting(false);
    }
  };

  const handleDeleteComment = async () => {
    if (!deleteCommentId) return;
    setDeletingComment(true);
    try {
      await deleteComment(id, deleteCommentId, token);
      setComments((prev) => prev.filter((c) => c._id !== deleteCommentId));
      setDeleteCommentId(null);
      toast.success("Comment deleted");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to delete comment");
    } finally {
      setDeletingComment(false);
    }
  };

  const openDeleteBlog = () => {
    setDeleteReason("");
    setDeleteBlogOpen(true);
  };

  const closeDeleteBlog = () => {
    if (deletingBlog) return;
    setDeleteBlogOpen(false);
    setDeleteReason("");
  };

  const handleDeleteBlog = async () => {
    if (deletingBlog) return;
    setDeletingBlog(true);
    try {
      await deleteBlog(id, token, deleteReason.trim());
      toast.success("Blog deleted");
      navigate(location.state?.from || "/blogs", { replace: true });
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to delete blog");
      setDeletingBlog(false);
    }
  };

  const handleApprove = async () => {
    if (reviewing) return;
    setReviewing(true);
    try {
      const data = await approveBlog(id, token);
      setBlog((prev) => ({ ...prev, status: "approved", reviewedBy: data.blog?.reviewedBy, reviewedAt: data.blog?.reviewedAt, rejectionReason: undefined }));
      toast.success("Blog approved");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve");
      if (error.response?.status === 409) {
        setBlog((prev) => ({ ...prev, status: error.response.data.currentStatus || prev.status }));
      }
    } finally {
      setReviewing(false);
    }
  };

  const handleReject = async () => {
    if (rejectReason.trim().length < 5 || rejectReason.trim().length > 300) return;
    setReviewing(true);
    try {
      const data = await rejectBlog(id, rejectReason.trim(), token);
      setBlog((prev) => ({ ...prev, status: "rejected", rejectionReason: rejectReason.trim(), reviewedBy: data.blog?.reviewedBy, reviewedAt: data.blog?.reviewedAt }));
      setRejectOpen(false);
      setRejectReason("");
      toast.success("Blog rejected");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject");
      if (error.response?.status === 409) {
        setBlog((prev) => ({ ...prev, status: error.response.data.currentStatus || prev.status }));
        setRejectOpen(false);
      }
    } finally {
      setReviewing(false);
    }
  };

  const patchComment = (commentId, fn) =>
    setComments((prev) => prev.map((c) => (c._id === commentId ? fn(c) : c)));

  const hasLiked = (likes) =>
    likes?.some((l) => (l._id || l).toString() === (user?._id || user?.id)?.toString());

  // Walks replies (and nested replies) and applies fn to the one matching replyId
  const mapReplies = (replies = [], replyId, fn) => {
    return replies.map((r) => {
      if (r._id === replyId) {
        return fn(r);
      }

      return {
        ...r,
        replies: mapReplies(r.replies || [], replyId, fn),
      };
    });
  };

  const dropReply = (replies = [], replyId) =>
    replies
      .filter((r) => r._id !== replyId)
      .map((r) => ({ ...r, replies: dropReply(r.replies, replyId) }));

  const handleLikeItem = async (commentId, replyId = null) => {
    try {
      const data = replyId
        ? await toggleReplyLike(id, commentId, replyId, token)
        : await toggleCommentLike(id, commentId, token);

      const myId = (user?._id || user?.id)?.toString();

      const applyLike = (item) => {
        const currentLikes = item.likes || [];

        const newLikes = data.liked
          ? [...currentLikes, myId]
          : currentLikes.filter((like) => (like._id || like).toString() !== myId);

        return { ...item, likes: newLikes };
      };

      patchComment(commentId, (c) => {
        if (!replyId) {
          return applyLike(c);
        }

        return {
          ...c,
          replies: mapReplies(c.replies || [], replyId, applyLike),
        };
      });
    } catch (error) {
      console.error("LIKE ERROR:", error.response?.data || error);

      toast.error(error.response?.data?.message || "Failed to update like");
    }
  };

  const handleAddReply = async (commentId, replyId = null) => {
    if (!replyText.trim() || replying) return;

    setReplying(true);

    try {
      const data = await addReply(id, commentId, replyText.trim(), token, replyId);

      // Backend returns the whole updated comment
      if (data?.comment) {
        patchComment(commentId, () => data.comment);
      } else {
        // Safety net: if the server answered with something else, reload from the server
        // so the screen always shows what is really saved.
        console.warn("addReply response had no `comment`:", data);
        const fresh = await getBlogById(id, token);
        setComments(fresh.blog.comments || []);
      }

      setOpenReplies((prev) => ({
        ...prev,
        [commentId]: true,
        ...(replyId ? { [replyId]: true } : {}),
      }));

      setReplyText("");
      setReplyingTo(null);

      toast.success("Reply posted");
    } catch (error) {
      console.error("ADD REPLY FRONTEND ERROR:", error);

      toast.error(error.response?.data?.message || "Failed to post reply");
    } finally {
      setReplying(false);
    }
  };

  const handleDeleteReply = async () => {
    if (!deleteReplyTarget) return;
    const { commentId, replyId } = deleteReplyTarget;
    try {
      await deleteReply(id, commentId, replyId, token);
      patchComment(commentId, (c) => ({ ...c, replies: dropReply(c.replies, replyId) }));
      setDeleteReplyTarget(null);
      toast.success("Reply deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete reply");
    }
  };

  const isAuthor = (blog.author?._id || blog.author)?.toString() === (user?._id || user?.id)?.toString();
  const isTeacher = user?.role === "teacher";
  const isAdmin = user?.role === "admin";
  const userId = (user?._id || user?.id)?.toString();
  const reviewerIdStr = blog.reviewedBy?._id?.toString();
  const canChangeDecision = isAdmin || reviewerIdStr === userId;
  // Show review bar to teacher/admin on pending, or to those who can change on reviewed blogs
  const canReview = (isTeacher || isAdmin) && (blog.status === "pending" || canChangeDecision);

  const paragraphs = (blog.content || "")
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const authorInitial =
    blog.author?.name?.charAt(0).toUpperCase() || "U";

  return (
    <div className="max-w-2xl mx-auto">

      {/* Top bar: Back on the left, admin Delete on the right */}
      <div className="flex items-center justify-between mb-5">

        <button
          onClick={goBack}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft size={17} />
          Back
        </button>

        {isAdmin && (
          <button
            onClick={openDeleteBlog}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition"
          >
            <Trash2 size={14} />
            Delete blog
          </button>
        )}

      </div>

      {/* Author status banner */}
      {isAuthor && blog.status !== "approved" && (
        <div className={`mb-4 px-4 py-3 rounded-xl border flex items-start gap-3 ${blog.status === "rejected"
          ? "bg-red-50 border-red-200"
          : "bg-amber-50 border-amber-200"
          }`}>
          {blog.status === "rejected"
            ? <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
            : <Clock size={18} className="text-amber-500 shrink-0 mt-0.5" />}
          <div>
            {blog.status === "rejected" ? (
              <>
                <p className="text-sm font-semibold text-red-700">Your blog was rejected</p>
                {blog.rejectionReason && (
                  <p className="text-sm text-red-600 mt-0.5">{blog.rejectionReason}</p>
                )}
              </>
            ) : (
              <p className="text-sm font-semibold text-amber-700">Waiting for review — your blog is not yet visible to others.</p>
            )}
          </div>
        </div>
      )}


      <article className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Review bar for teachers/admins */}
        {canReview && (
          <div className="px-6 sm:px-10 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-indigo-500" />
                <span className="text-sm font-semibold text-slate-700">
                  {blog.status === "pending" && "Pending review"}
                  {blog.status === "approved" && "Approved"}
                  {blog.status === "rejected" && "Rejected"}
                </span>
                {blog.reviewedBy?.name && (
                  <span className="text-xs text-slate-400">
                    · Reviewed by {blog.reviewedBy.name}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {(blog.status === "pending" || canChangeDecision) && (
                  <button
                    onClick={handleApprove}
                    disabled={reviewing || blog.status === "approved"}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-semibold border border-green-200 hover:bg-green-100 transition disabled:opacity-40"
                  >
                    <CheckCircle size={13} /> Approve
                  </button>
                )}
                {(blog.status === "pending" || canChangeDecision) && (
                  <button
                    onClick={() => setRejectOpen(true)}
                    disabled={reviewing || blog.status === "rejected"}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold border border-red-200 hover:bg-red-100 transition disabled:opacity-40"
                  >
                    <XCircle size={13} /> Reject
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="px-6 sm:px-10 pt-8 sm:pt-10">

          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 leading-tight wrap-break-word">
            {blog.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 mt-5">

            <div className="flex items-center gap-2.5">

              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                {authorInitial}
              </div>

              <div className="leading-tight">
                <p className="text-sm font-semibold text-slate-800">
                  {blog.author?.name || "Unknown Author"}
                </p>

                <p className="text-xs text-slate-400 capitalize">
                  {blog.author?.role || "Author"}
                </p>
              </div>

            </div>

            <span className="hidden sm:block w-px h-6 bg-slate-200"></span>

            {blog.createdAt && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <CalendarDays size={14} />
                {new Date(blog.createdAt).toLocaleDateString(
                  undefined,
                  { year: "numeric", month: "short", day: "numeric" }
                )}
              </div>
            )}

          </div>

        </div>


        {/* Cover Photo / Video */}
        {blog.image && (
          <div className="px-6 sm:px-10 mt-7">
            <div className="aspect-2/1 rounded-xl overflow-hidden bg-slate-100 relative">

              {!showVideo ? (
                <>
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />

                  {blog.videoId?.playbackId && (
                    <button
                      onClick={() => setShowVideo(true)}
                      className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/30 transition group"
                    >
                      <span className="w-16 h-16 rounded-full bg-white/90 group-hover:scale-110 transition flex items-center justify-center shadow-lg">
                        <span className="text-indigo-600 text-2xl ml-1">
                          ▶
                        </span>
                      </span>
                    </button>
                  )}
                </>
              ) : (
                <MuxPlayer
                  playbackId={blog.videoId.playbackId}
                  streamType="on-demand"
                  className="w-full h-full"
                />
              )}

            </div>
          </div>
        )}

        {/* Content */}
        <div className="px-6 sm:px-10 py-8 sm:py-10">

          {paragraphs.map((text, index) => (
            <p
              key={index}
              className="text-[17px] text-slate-700 leading-8 mb-5 last:mb-0 wrap-break-word"
            >
              {text}
            </p>
          ))}

        </div>


        {/* Action Bar */}
        <div className="px-6 sm:px-10 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div className="flex items-center gap-3">

            <button
              onClick={handleLike}
              disabled={liking}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition ${liked
                ? "bg-red-50 text-red-500 hover:bg-red-100"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
            >
              <Heart size={16} fill={liked ? "currentColor" : "none"} />
              <span>{likeCount}</span>
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition ${saved
                ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
            >
              <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
            </button>

          </div>

          <div className="flex items-center gap-3">

            <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
              {authorInitial}
            </div>

            <div className="leading-tight">
              <p className="text-xs text-slate-400">Written by</p>
              <p className="text-sm font-semibold text-slate-800">
                {blog.author?.name || "Unknown Author"}
              </p>
            </div>

          </div>

        </div>


        {/* Comments */}
        <div className="px-6 sm:px-10 py-8 border-t border-slate-100">

          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <MessageCircle size={16} />
            Comments ({comments.length})
          </h3>

          {/* Input */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              placeholder="Write a comment..."
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <button
              onClick={handleAddComment}
              disabled={commenting || !commentText.trim()}
              className="px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              Post
            </button>
          </div>

          {/* List */}
          {comments.length === 0 ? (
            <p className="text-sm text-slate-400">No comments yet. Be the first!</p>
          ) : (
            <div className="space-y-3 max-h-100 overflow-y-auto pr-2 hide-scrollbar">
              {comments
                .slice(0, showAllComments ? comments.length : 4)
                .map((c) => {
                  const isOwner = (c.author?._id || c.author)?.toString() === (user?._id || user?.id)?.toString();
                  // The writer or an admin can delete a comment
                  const canDeleteComment = isOwner || isAdmin;
                  return (
                    <div key={c._id}>
                      <div className="flex items-start gap-3 bg-slate-50 rounded-xl px-4 py-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
                          {c.author?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-700">{c.author?.name || "User"}</p>
                          <p className="text-sm text-slate-600 mt-0.5 wrap-break-word">{c.text}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <button
                              onClick={() => handleLikeItem(c._id)}
                              className={`flex items-center gap-1 text-xs font-semibold transition ${hasLiked(c.likes) ? "text-red-500" : "text-slate-400 hover:text-red-400"}`}
                            >
                              <Heart size={13} fill={hasLiked(c.likes) ? "currentColor" : "none"} />
                              {c.likes?.length || 0}
                            </button>

                            <button
                              onClick={() => {
                                setReplyingTo(
                                  replyingTo?.commentId === c._id && replyingTo?.replyId === null
                                    ? null
                                    : { commentId: c._id, replyId: null }
                                );
                                setReplyText("");
                              }}
                              className="text-xs font-semibold text-slate-400 hover:text-indigo-600 transition"
                            >
                              Reply
                            </button>

                            {c.replies?.length > 0 && (
                              <button
                                onClick={() => setOpenReplies((p) => ({ ...p, [c._id]: !p[c._id] }))}
                                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition"
                              >
                                {openReplies[c._id] ? "Hide replies" : `View ${c.replies.length} repl${c.replies.length === 1 ? "y" : "ies"}`}
                              </button>
                            )}
                          </div>
                        </div>
                        {canDeleteComment && (
                          <button
                            onClick={() => setDeleteCommentId(c._id)}
                            className="text-slate-300 hover:text-red-400 transition shrink-0 mt-0.5"
                            aria-label="Delete comment"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      {/* Reply-to-comment input */}
                      {replyingTo?.commentId === c._id &&
                        replyingTo?.replyId === null && (
                          <div className="ml-11 mt-2 flex gap-2">
                            <input
                              autoFocus
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && handleAddReply(c._id)}
                              placeholder={`Reply to ${c.author?.name || "comment"}...`}
                              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            />
                            <button
                              onClick={() => handleAddReply(c._id)}
                              disabled={replying || !replyText.trim()}
                              className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                            >
                              Reply
                            </button>
                          </div>
                        )}

                      {/* Replies */}
                      {openReplies[c._id] && c.replies?.map((r) => {
                        const mine =
                          (r.author?._id || r.author)?.toString() ===
                          (user?._id || user?.id)?.toString();

                        const isReplyingToThis =
                          replyingTo?.commentId === c._id &&
                          replyingTo?.replyId === r._id;

                        return (
                          <div key={r._id} className="ml-11 mt-2">

                            {/* Reply */}
                            <div className="flex items-start gap-2.5 border-l-2 border-slate-100 pl-3">

                              <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                                {r.author?.name?.charAt(0).toUpperCase() || "U"}
                              </div>

                              <div className="flex-1 min-w-0">

                                <p className="text-xs font-semibold text-slate-700">
                                  {r.author?.name || "User"}
                                </p>

                                <p className="text-sm text-slate-600 mt-0.5 wrap-break-word">
                                  {r.text}
                                </p>

                                {/* Like + Reply */}
                                <div className="flex items-center gap-4 mt-1">

                                  <button
                                    onClick={() => handleLikeItem(c._id, r._id)}
                                    className={`flex items-center gap-1 text-xs font-semibold transition ${hasLiked(r.likes)
                                      ? "text-red-500"
                                      : "text-slate-400 hover:text-red-400"
                                      }`}
                                  >
                                    <Heart
                                      size={12}
                                      fill={hasLiked(r.likes) ? "currentColor" : "none"}
                                    />
                                    {r.likes?.length || 0}
                                  </button>

                                  <button
                                    onClick={() => {
                                      setReplyingTo(
                                        isReplyingToThis
                                          ? null
                                          : { commentId: c._id, replyId: r._id }
                                      );
                                      setReplyText("");
                                    }}
                                    className="text-xs font-semibold text-slate-400 hover:text-indigo-600 transition"
                                  >
                                    Reply
                                  </button>

                                  {r.replies?.length > 0 && (
                                    <button
                                      onClick={() => setOpenReplies((p) => ({ ...p, [r._id]: !p[r._id] }))}
                                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition"
                                    >
                                      {openReplies[r._id]
                                        ? "Hide replies"
                                        : `View ${r.replies.length} repl${r.replies.length === 1 ? "y" : "ies"}`}
                                    </button>
                                  )}

                                </div>
                              </div>

                              {/* Delete */}
                              {(mine || isAdmin) && (
                                <button
                                  onClick={() =>
                                    setDeleteReplyTarget({
                                      commentId: c._id,
                                      replyId: r._id,
                                    })
                                  }
                                  className="text-slate-300 hover:text-red-500 transition"
                                >
                                  <Trash2 size={13} />
                                </button>
                              )}
                            </div>

                            {/* Reply-to-reply input */}
                            {isReplyingToThis && (
                              <div className="ml-9 mt-2 flex gap-2">

                                <input
                                  autoFocus
                                  type="text"
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  onKeyDown={(e) =>
                                    e.key === "Enter" && handleAddReply(c._id, r._id)
                                  }
                                  placeholder={`Reply to ${r.author?.name || "User"}...`}
                                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                />

                                <button
                                  onClick={() => handleAddReply(c._id, r._id)}
                                  disabled={replying || !replyText.trim()}
                                  className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
                                >
                                  Reply
                                </button>

                              </div>
                            )}

                            {/* Nested replies */}
                            {openReplies[r._id] && r.replies?.map((nested) => {
                              const nestedMine =
                                (nested.author?._id || nested.author)?.toString() ===
                                (user?._id || user?.id)?.toString();

                              return (
                                <div
                                  key={nested._id}
                                  className="ml-9 mt-2 flex items-start gap-2.5 border-l-2 border-slate-100 pl-3"
                                >

                                  <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                                    {nested.author?.name?.charAt(0).toUpperCase() || "U"}
                                  </div>

                                  <div className="flex-1 min-w-0">

                                    <p className="text-xs font-semibold text-slate-700">
                                      {nested.author?.name || "User"}
                                    </p>

                                    <p className="text-sm text-slate-600 mt-0.5 wrap-break-word">
                                      {nested.text}
                                    </p>

                                    {/* Nested reply like */}
                                    <button
                                      onClick={() => handleLikeItem(c._id, nested._id)}
                                      className={`flex items-center gap-1 mt-1 text-xs font-semibold ${hasLiked(nested.likes)
                                        ? "text-red-500"
                                        : "text-slate-400 hover:text-red-400"
                                        }`}
                                    >
                                      <Heart
                                        size={12}
                                        fill={hasLiked(nested.likes) ? "currentColor" : "none"}
                                      />
                                      {nested.likes?.length || 0}
                                    </button>

                                  </div>

                                  {nestedMine || isAdmin ? (
                                    <button
                                      onClick={() =>
                                        setDeleteReplyTarget({
                                          commentId: c._id,
                                          replyId: nested._id,
                                        })
                                      }
                                      className="text-slate-300 hover:text-red-500 transition"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  ) : null}

                                </div>
                              );
                            })}

                          </div>
                        );
                      })}

                    </div>
                  );
                })}
            </div>
          )}

          {/* Show more / less (kept inside the comments section) */}
          {comments.length > 4 && (
            <div className="flex justify-center mt-5">
              <button
                onClick={() => setShowAllComments((prev) => !prev)}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition"
              >
                {showAllComments
                  ? "Show less ↑"
                  : `Show more comments (${comments.length - 4}) ↓`}
              </button>
            </div>
          )}

        </div>

      </article>

      {/* Delete comment dialog */}
      <ConfirmDialog
        open={!!deleteCommentId}
        title="Delete this comment?"
        message="This cannot be undone."
        loading={deletingComment}
        onConfirm={handleDeleteComment}
        onCancel={() => setDeleteCommentId(null)}
      />

      {/* Delete reply dialog (moved OUT of the delete-blog dialog so it can open on its own) */}
      <ConfirmDialog
        open={!!deleteReplyTarget}
        title="Delete this reply?"
        message="This cannot be undone."
        onConfirm={handleDeleteReply}
        onCancel={() => setDeleteReplyTarget(null)}
      />

      {/* Delete blog dialog (admin) */}
      <ConfirmDialog
        open={deleteBlogOpen}
        title="Delete this blog?"
        message="This permanently removes the blog and its video, and the author will be notified."
        loading={deletingBlog}
        onConfirm={handleDeleteBlog}
        onCancel={closeDeleteBlog}
      >
        <div className="mt-4 text-left">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Reason (optional, shown to the author)
          </label>

          <textarea
            value={deleteReason}
            onChange={(e) => setDeleteReason(e.target.value.slice(0, 200))}
            rows={3}
            placeholder="Why is this blog being removed?"
            className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
          />

          <p className="text-right text-[11px] text-slate-400 mt-1">
            {deleteReason.length}/200
          </p>
        </div>
      </ConfirmDialog>

      {/* Reject modal */}
      {rejectOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={(e) => e.target === e.currentTarget && setRejectOpen(false)}
        >
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-slate-800">Reject blog</h3>
            <p className="text-sm text-slate-500 mt-1">Provide a reason so the author can improve their blog.</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              maxLength={300}
              placeholder="Enter rejection reason (5–300 characters)..."
              className="mt-4 w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 resize-none outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
            />
            <div className="flex justify-between items-center mt-1">
              <span className={`text-xs ${rejectReason.trim().length < 5 || rejectReason.trim().length > 300
                ? "text-red-400"
                : "text-slate-400"
                }`}>
                {rejectReason.trim().length}/300
              </span>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setRejectOpen(false); setRejectReason(""); }}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={reviewing || rejectReason.trim().length < 5 || rejectReason.trim().length > 300}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition disabled:opacity-50"
              >
                {reviewing ? "Rejecting..." : "Reject Blog"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BlogDetails;