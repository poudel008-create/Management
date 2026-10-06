import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BookOpen, Trash2 } from "lucide-react";

import { getBlogs, deleteBlog } from "../services/blogService";
import { useAuth } from "../context/authContext";
import BlogCard from "../components/blogCard";
import ConfirmDialog from "../components/confirmDialog";

const Blogs = () => {
  const { token, user } = useAuth();

  const isAdmin = user?.role === "admin";

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Admin delete
  const [toDelete, setToDelete] = useState(null);
  const [reason, setReason] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      if (!token) return;

      try {
        const data = await getBlogs(token);
        setBlogs(data.blogs || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [token]);

  const askDelete = (blog) => {
    setReason("");
    setToDelete(blog);
  };

  const closeDialog = () => {
    if (deleting) return;
    setToDelete(null);
    setReason("");
  };

  const confirmDelete = async () => {
    if (!toDelete) return;

    setDeleting(true);

    try {
      await deleteBlog(toDelete._id, token, reason.trim());

      setBlogs((prev) => prev.filter((b) => b._id !== toDelete._id));

      toast.success("Blog deleted");

      setToDelete(null);
      setReason("");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete blog"
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-slate-500">
            Loading blogs...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <p className="text-indigo-600 text-sm font-semibold uppercase tracking-wide">
          Community Blogs
        </p>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mt-2">
          Explore Our Blogs
        </h1>

        <p className="text-slate-500 mt-2 max-w-2xl">
          Discover ideas, knowledge and experiences shared by
          our students and teachers.
        </p>
      </div>


      {/* Blogs */}
      {blogs.length === 0 ? (

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">

          <div className="w-14 h-14 mx-auto rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <BookOpen size={26} />
          </div>

          <h2 className="text-xl font-semibold text-slate-800 mt-5">
            No blogs yet
          </h2>

          <p className="text-slate-500 mt-2">
            Be the first one to share something interesting.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

          {blogs.map((blog) => (
            <BlogCard
              key={blog._id}
              blog={blog}
              from="/blogs"
              action={
                isAdmin ? (
                  <button
                    onClick={() => askDelete(blog)}
                    className="w-8 h-8 rounded-full bg-white/90 text-slate-500 shadow flex items-center justify-center hover:bg-white hover:text-red-600 transition"
                    aria-label="Delete blog"
                    title="Delete blog"
                  >
                    <Trash2 size={15} />
                  </button>
                ) : null
              }
            />
          ))}

        </div>

      )}


      {/* Admin delete dialog */}
      <ConfirmDialog
        open={!!toDelete}
        title="Delete this blog?"
        message="This permanently removes the blog and its video, and the author will be notified."
        confirmText="Delete"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={closeDialog}
      >
        <div className="mt-4 text-left">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Reason (optional, shown to the author)
          </label>

          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value.slice(0, 200))}
            rows={3}
            placeholder="Why is this blog being removed?"
            className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
          />

          <p className="text-right text-[11px] text-slate-400 mt-1">
            {reason.length}/200
          </p>
        </div>
      </ConfirmDialog>

    </div>
  );
};

export default Blogs;