import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, ArrowRight } from "lucide-react";

import { getSavedBlogs } from "../services/blogService";
import { useAuth } from "../context/authContext";
import BlogListItem from "../components/blogListiTtem";

const SavedBlogs = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const data = await getSavedBlogs(token);
        setBlogs(data.blogs || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchSaved();
    }
  }, [token]);

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
      <div className="mb-6">
        <p className="text-indigo-600 text-sm font-semibold uppercase tracking-wide">
          Saved Blogs
        </p>

        <h1 className="text-3xl font-bold text-slate-800 mt-2">
          Your reading list
        </h1>

        <p className="text-slate-500 mt-2">
          {blogs.length > 0
            ? `${blogs.length} blog${blogs.length !== 1 ? "s" : ""} saved to read later.`
            : "Blogs you save will show up here."}
        </p>
      </div>


      {blogs.length === 0 ? (

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">

          <div className="w-14 h-14 mx-auto rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Bookmark size={26} />
          </div>

          <h2 className="text-xl font-semibold text-slate-800 mt-5">
            No saved blogs yet
          </h2>

          <p className="text-slate-500 mt-2">
            Save a blog to read it later and it will appear here.
          </p>

          <button
            onClick={() => navigate("/blogs")}
            className="mt-6 inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            Browse Blogs
            <ArrowRight size={18} />
          </button>

        </div>

      ) : (

        <div className="space-y-3">
          {blogs.map((blog) => (
            <BlogListItem
              key={blog._id}
              blog={blog}
              from="/blogs/saved"
            />
          ))}
        </div>

      )}

    </div>
  );
};

export default SavedBlogs;