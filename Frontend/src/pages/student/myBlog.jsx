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
        setBlogs(data.blogs);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBlogs();
  }, [token]);

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
      <div className="flex items-center justify-center py-20">
        <p className="text-slate-500">
          Loading your blogs...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">

      {/* Header */}
      <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6 sm:p-7 mb-8">

        <div className="flex flex-col sm:flex-row justify-between gap-5 sm:items-center">

          <div>
            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-white text-purple-600 flex items-center justify-center border border-purple-100">
                <FileText size={22} />
              </div>

              <div>
                <p className="text-purple-600 text-sm font-semibold uppercase tracking-wide">
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
            onClick={() => navigate("/user/create-blog")}
            className="flex items-center justify-center gap-2 bg-purple-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-purple-700 transition shadow-sm"
          >
            <Plus size={18} />
            Create Blog
          </button>

        </div>

      </div>


      {/* No Blogs */}
      {blogs.length === 0 ? (

        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">

          <div className="w-14 h-14 mx-auto rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
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
            className="mt-6 inline-flex items-center gap-2 bg-purple-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
          >
            Create Your First Blog
            <ArrowRight size={18} />
          </button>

        </div>

      ) : (

        /* Blog Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {blogs.map((blog) => (

            <article
              key={blog._id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition"
            >

              {/* Image */}
              <div className="h-48 bg-slate-100 overflow-hidden">

                {blog.image ? (

                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />

                ) : (

                  <div className="h-full flex flex-col items-center justify-center text-slate-400">

                    <FileText size={28} />

                    <span className="text-sm mt-2">
                      No Image
                    </span>

                  </div>

                )}

              </div>


              {/* Content */}
              <div className="p-6">

                <h2 className="text-xl font-bold text-slate-800 line-clamp-2">
                  {blog.title}
                </h2>

                <p className="text-slate-500 mt-3 line-clamp-3 leading-6">
                  {blog.content}
                </p>


                {/* Actions */}
                <div className="flex gap-3 mt-6 pt-5 border-t border-slate-100">

                  <button
                    onClick={() =>
                      navigate(`/user/edit-blog/${blog._id}`)
                    }
                    className="flex-1 flex items-center justify-center gap-2 bg-purple-50 text-purple-700 px-4 py-2.5 rounded-lg font-medium hover:bg-purple-100 transition"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>


                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2.5 rounded-lg font-medium hover:bg-red-100 transition"
                  >
                    <Trash2 size={16} />
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