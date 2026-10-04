import { useEffect, useState } from "react";
import { getBlogs } from "../services/blogService";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

import { BookOpen, ArrowRight, ImageOff } from "lucide-react";

const Blogs = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const openBlog = (id) => {
    navigate(`/blogs/${id}`, {
      state: { from: "/blogs" },
    });
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

            <article
              key={blog._id}
              onClick={() => openBlog(blog._id)}
              className="group bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition cursor-pointer flex flex-col"
            >

              {/* Image */}
              <div className="h-40 bg-slate-100 overflow-hidden shrink-0">

                {blog.image ? (

                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />

                ) : (

                  <div className="h-full flex flex-col items-center justify-center text-slate-300">
                    <ImageOff size={26} />
                    <span className="text-xs mt-1.5">
                      No image
                    </span>
                  </div>

                )}

              </div>


              {/* Content */}
              <div className="p-4 flex flex-col flex-1">

                <h2 className="text-lg font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-indigo-600 transition">
                  {blog.title}
                </h2>

                <p className="text-sm text-slate-500 mt-1.5 leading-5 line-clamp-2">
                  {blog.content}
                </p>


                {/* Footer */}
                <div className="flex items-center justify-between gap-3 mt-auto pt-4">

                  <div className="flex items-center gap-2 min-w-0">

                    <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
                      {blog.author?.name
                        ?.charAt(0)
                        .toUpperCase() || "U"}
                    </div>

                    <p className="text-xs font-medium text-slate-600 truncate">
                      {blog.author?.name || "Unknown Author"}
                    </p>

                  </div>


                  <span className="flex items-center gap-1 text-xs font-semibold text-indigo-600 shrink-0">
                    View details
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-0.5 transition"
                    />
                  </span>

                </div>

              </div>

            </article>

          ))}

        </div>

      )}

    </div>
  );
};

export default Blogs;