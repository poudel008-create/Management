import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ArrowRight } from "lucide-react";

import { getBlogs } from "../services/blogService";
import { useAuth } from "../context/authContext";
import BlogListItem from "../components/blogListiTtem";

const LikedBlogs = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiked = async () => {
      try {
        const data = await getBlogs(token);

        const userId = (user?._id || user?.id)?.toString();

        const liked = (data.blogs || []).filter((b) =>
          b.likes?.some((l) => (l._id || l).toString() === userId)
        );

        setBlogs(liked);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchLiked();
    }
  }, [token, user]);

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
          Liked Blogs
        </p>

        <h1 className="text-3xl font-bold text-slate-800 mt-2">
          Blogs you liked
        </h1>

        <p className="text-slate-500 mt-2">
          {blogs.length > 0
            ? `${blogs.length} blog${blogs.length !== 1 ? "s" : ""} you've shown some love.`
            : "Blogs you like will show up here."}
        </p>
      </div>


      {blogs.length === 0 ? (

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">

          <div className="w-14 h-14 mx-auto rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Heart size={26} />
          </div>

          <h2 className="text-xl font-semibold text-slate-800 mt-5">
            No liked blogs yet
          </h2>

          <p className="text-slate-500 mt-2">
            Tap the heart on any blog you enjoy and it will appear here.
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
              from="/blogs/liked"
            />
          ))}
        </div>

      )}

    </div>
  );
};

export default LikedBlogs;