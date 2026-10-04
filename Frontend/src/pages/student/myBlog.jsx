import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyBlogs, deleteBlog } from "../../services/blogService";
import { useAuth } from "../../context/authContext";

import {
  Plus,
  Pencil,
  Trash2,
  ArrowRight,
  FileText,
  ImageOff,
  CalendarDays,
} from "lucide-react";

const MyBlogs = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyBlogs = async () => {
      if (!token) return;

      try {
        const data = await getMyBlogs(token);
        setBlogs(data.blogs || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBlogs();
  }, [token]);

  const openBlog = (id) => {
    navigate(`/blogs/${id}`, {
      state: { from: "/user/my-blogs" },
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );

    if (!confirmDelete) return;

    try {
      await deleteBlog(id, token);

      setBlogs((prevBlogs) =>
        prevBlogs.filter((blog) => blog._id !== id)
      );

      alert("Blog deleted successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to delete blog");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-slate-500">
            Loading your blogs...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">

      {/* Header */}
      <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-6 sm:p-7 mb-8">

        <div className="flex flex-col sm:flex-row justify-between gap-5 sm:items-center">

          <div>
            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-white text-indigo-600 flex items-center justify-center border border-indigo-100">
                <FileText size={22} />
              </div>

              <div>
                <p className="text-indigo-600 text-sm font-semibold uppercase tracking-wide">
                  My Blogs
                </p>

                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">
                  Your Published Blogs
                </h1>
              </div>

            </div>

            <p className="text-slate-500 mt-3">
              Manage the blogs you have created.
            </p>
          </div>

          <button
            onClick={() => navigate("/user/create-blog",{state:{from:"/user/my-blogs"}})}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-sm shadow-indigo-600/20"
          >
            <Plus size={18} />
            Create Blog
          </button>

        </div>

      </div>


      {/* No Blogs */}
      {blogs.length === 0 ? (

        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">

          <div className="w-14 h-14 mx-auto rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FileText size={26} />
          </div>

          <h2 className="text-xl font-semibold text-slate-800 mt-5">
            You haven't created any blogs yet.
          </h2>

          <p className="text-slate-500 mt-2">
            Start sharing your ideas with the community.
          </p>

          <button
            onClick={() => navigate("/user/create-blog")}
            className="mt-6 inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            Create Your First Blog
            <ArrowRight size={18} />
          </button>

        </div>

      ) : (

        /* Blog Cards */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {blogs.map((blog) => (

            <article
              key={blog._id}
              onClick={() => openBlog(blog._id)}
              className="group bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition cursor-pointer flex flex-col"
            >

              {/* Image */}
              <div className="h-44 bg-slate-100 overflow-hidden shrink-0">

                {blog.image ? (

                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />

                ) : (

                  <div className="h-full flex flex-col items-center justify-center text-slate-300">
                    <ImageOff size={28} />
                    <span className="text-xs mt-1.5">
                      No image
                    </span>
                  </div>

                )}

              </div>


              {/* Content */}
              <div className="p-5 flex flex-col flex-1">

                <h2 className="text-lg font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-indigo-600 transition">
                  {blog.title}
                </h2>

                <p className="text-sm text-slate-500 mt-1.5 leading-5 line-clamp-2">
                  {blog.content}
                </p>


                {/* Date + View details */}
                <div className="flex items-center justify-between gap-3 mt-auto pt-4">

                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <CalendarDays size={14} />
                    {blog.createdAt
                      ? new Date(blog.createdAt).toLocaleDateString()
                      : "—"}
                  </div>

                  <span className="flex items-center gap-1 text-xs font-semibold text-indigo-600">
                    View details
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-0.5 transition"
                    />
                  </span>

                </div>


                {/* Actions */}
                <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/user/edit-blog/${blog._id}`);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-indigo-100 transition"
                  >
                    <Pencil size={15} />
                    Edit
                  </button>


                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(blog._id);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition"
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>

                </div>

              </div>

            </article>

          ))}

        </div>

      )}

    </div>
  );
};

export default MyBlogs;