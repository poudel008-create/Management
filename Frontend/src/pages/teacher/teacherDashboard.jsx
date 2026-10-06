import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { getBlogs, getReviewBlogs } from "../../services/blogService";

import {
  BookOpen,
  Users,
  Clock,
  ArrowRight,
  User,
  FileText,
  ClipboardCheck,
} from "lucide-react";

const TeacherD = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [blogs, setBlogs] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const [data, reviewData] = await Promise.all([
          getBlogs(token),
          getReviewBlogs("pending", token),
        ]);
        setBlogs(data.blogs || []);
        setPendingCount(reviewData.counts?.pending ?? reviewData.blogs?.length ?? 0);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchBlogs();
    }
  }, [token]);

  // Count unique students who have written blogs
  const studentAuthors = new Set(
    blogs
      .filter((blog) => blog.author)
      .map((blog) => blog.author._id)
  );

  const studentCount = studentAuthors.size;

  // Already sorted latest first from backend
  const recentBlogs = blogs.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <p className="text-indigo-600 text-sm font-semibold uppercase tracking-wide">
          Teacher Dashboard
        </p>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mt-2">
          Welcome, {user?.name}
        </h1>

        <p className="text-slate-500 mt-2">
          Monitor student activity and explore their blogs.
        </p>
      </div>


      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">

        {/* Total Blogs */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Total Blogs
              </p>

              <h2 className="text-3xl font-bold text-slate-800 mt-2">
                {loading ? "—" : blogs.length}
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                Published student blogs
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen size={24} />
            </div>

          </div>
        </div>


        {/* Student Contributors */}
        <div
          onClick={() => navigate("/teacher/students")}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-indigo-300 hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Student Contributors
              </p>

              <h2 className="text-3xl font-bold text-slate-800 mt-2">
                {loading ? "—" : studentCount}
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                Students who posted blogs
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users size={24} />
            </div>

          </div>
        </div>


        {/* Pending Review */}
        <div
          onClick={() => navigate("/review")}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-indigo-300 hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Pending Review</p>
              <h2 className="text-3xl font-bold text-slate-800 mt-2">
                {loading ? "—" : pendingCount}
              </h2>
              <p className="text-xs text-slate-400 mt-1">Blogs awaiting approval</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ClipboardCheck size={24} />
            </div>
          </div>
        </div>


        {/* Latest Blog */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">

            <div className="min-w-0">
              <p className="text-sm text-slate-500">
                Latest Blog
              </p>

              <h2 className="text-lg font-bold text-slate-800 mt-2 truncate">
                {loading
                  ? "Loading..."
                  : recentBlogs.length > 0
                    ? recentBlogs[0].title
                    : "No blogs yet"}
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                {recentBlogs.length > 0
                  ? new Date(
                    recentBlogs[0].createdAt
                  ).toLocaleDateString()
                  : "—"}
              </p>
            </div>

            <div className="w-12 h-12 shrink-0 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock size={24} />
            </div>

          </div>
        </div>

      </div>


      {/* Recent Blogs */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        {/* Section Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Recent Student Blogs
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Latest blogs published by students.
              </p>
            </div>

            <button
              onClick={() => navigate("/blogs")}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
            >
              View All Blogs
              <ArrowRight size={17} />
            </button>

          </div>
        </div>


        {/* Blog List */}
        <div>

          {loading ? (
            <div className="p-10 text-center text-slate-500">
              Loading blogs...
            </div>
          ) : recentBlogs.length === 0 ? (
            <div className="p-12 text-center">

              <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                <BookOpen size={26} />
              </div>

              <h3 className="font-semibold text-slate-700 mt-4">
                No blogs yet
              </h3>

              <p className="text-sm text-slate-400 mt-1">
                Student blogs will appear here.
              </p>

            </div>
          ) : (
            recentBlogs.map((blog) => (
              <div
                key={blog._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition"
              >

                {/* Blog Info */}
                <div className="flex items-start gap-4 min-w-0">

                  <div className="w-11 h-11 shrink-0 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <FileText size={20} />
                  </div>

                  <div className="min-w-0">

                    <h3 className="font-semibold text-slate-800 truncate">
                      {blog.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 mt-1">

                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <User size={14} />
                        {blog.author?.name || "Unknown"}
                      </div>

                      <span className="text-slate-300">
                        •
                      </span>

                      <p className="text-xs text-slate-400">
                        {new Date(
                          blog.createdAt
                        ).toLocaleDateString()}
                      </p>

                    </div>

                  </div>

                </div>


                {/* View */}
                <button
                  onClick={() =>
                    navigate(`/blogs/${blog._id}`, {
                      state: { from: "/teacher" },
                    })
                  }
                  className="self-start sm:self-auto flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition"
                >
                  View
                  <ArrowRight size={16} />
                </button>

              </div>
            ))
          )}

        </div>

      </div>


      {/* Quick Actions */}
      <div className="mt-8">

        <h2 className="text-xl font-bold text-slate-800">
          Quick Actions
        </h2>

        <p className="text-sm text-slate-500 mt-1 mb-4">
          Access common teacher features.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* View Blogs */}
          <button
            onClick={() => navigate("/blogs")}
            className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:border-indigo-300 hover:shadow-sm transition group"
          >
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-4">

                <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <BookOpen size={21} />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800">
                    View Student Blogs
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Explore all published blogs.
                  </p>
                </div>

              </div>

              <ArrowRight
                size={19}
                className="text-slate-400 group-hover:text-indigo-600 transition"
              />

            </div>
          </button>


          {/* Profile */}
          <button
            onClick={() => navigate("/teacher/profile")}
            className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:border-indigo-300 hover:shadow-sm transition group"
          >
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-4">

                <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <User size={21} />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800">
                    My Profile
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    View your account information.
                  </p>
                </div>

              </div>

              <ArrowRight
                size={19}
                className="text-slate-400 group-hover:text-indigo-600 transition"
              />

            </div>
          </button>

        </div>

      </div>

    </div>
  );
};

export default TeacherD;