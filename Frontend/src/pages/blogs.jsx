import { useEffect, useState } from "react";
import { getBlogs } from "../services/blogService";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-slate-300 border-t-slate-700 rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-slate-500">
            Loading blogs...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">

      {/* HEADER */}
      <div className="bg-white border-b border-purple-100">
        <div className="max-w-6xl mx-auto px-6 py-10">

          <p className="text-slate-700 text-sm font-semibold tracking-widest mb-2">
            COMMUNITY BLOGS
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
            Explore Our Blogs
          </h1>

          <p className="text-slate-500 mt-3 max-w-2xl leading-6">
            Discover ideas, knowledge and experiences shared by
            our students and teachers.
          </p>

        </div>
      </div>

      {/* BLOGS */}
      <div className="max-w-6xl mx-auto px-6 py-10">

        {blogs.length === 0 ? (

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">

            <h2 className="text-xl font-semibold text-purple-800">
              No blogs yet
            </h2>

            <p className="text-slate-500 mt-2">
              Be the first one to share something interesting.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">

            {blogs.map((blog) => (

              <article
                key={blog._id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300 flex flex-col"
              >

                {/* IMAGE */}
                <div className="h-52 bg-slate-200 overflow-hidden shrink-0">

                  {blog.image ? (

                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />

                  ) : (

                    <div className="h-full flex items-center justify-center text-slate-400">
                      No Image
                    </div>

                  )}

                </div>

                {/* CONTENT */}
                <div className="p-6 flex flex-col flex-1">

                  <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
                    Blog
                  </p>

                  <h2 className="text-xl font-bold text-slate-800 line-clamp-2 min-h-14">
                    {blog.title}
                  </h2>

                  <p className="text-slate-600 mt-3 leading-6 line-clamp-3 min-h-18">
                    {blog.content}
                  </p>

                  {/* VIEW DETAILS */}
                  <button
                    onClick={() =>
                      navigate(`/blogs/${blog._id}`, {
                        state: { from: "/blogs" },
                      })
                    }
                    className="mt-5 w-full py-2.5 rounded-lg bg-white/20 text-slate-700 border-2 border-slate-700 font-semibold hover:bg-slate-50 transition"
                  >
                    View Details
                  </button>

                  {/* AUTHOR */}
                  <div className="flex items-center gap-3  pt-5 border-t border-slate-100 mt-6">

                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold shrink-0">
                      {blog.author?.name
                        ?.charAt(0)
                        .toUpperCase() || "U"}
                    </div>

                    <div className="min-w-0">

                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {blog.author?.name || "Unknown Author"}
                      </p>

                      <p className="text-xs text-slate-400">
                        Blog Author
                      </p>

                    </div>

                  </div>

                </div>

              </article>

            ))}

          </div>

        )}

      </div>

    </div>
  );
};

export default Blogs;