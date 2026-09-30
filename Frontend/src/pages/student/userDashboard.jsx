import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

import {
  PenLine,
  BookOpen,
  FileText,
  User,
  ArrowRight,
  CircleCheck,
  Sparkles,
} from "lucide-react";

const UserD = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto">

      {/* Page Header */}
      <div className="mb-8">
        <p className="text-purple-600 text-sm font-semibold uppercase tracking-wide">
          Student Dashboard
        </p>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mt-2">
          Welcome, {user?.name}
        </h1>

        <p className="text-slate-500 mt-2">
          Create, manage, and explore blogs from the student community.
        </p>
      </div>


      {/* Welcome Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-8">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">

          <div className="flex items-start gap-4">

            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Sparkles size={22} />
            </div>

            <div>
              <p className="text-sm font-medium text-purple-600 mb-1">
                Student Portal
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                Ready to share your ideas?
              </h2>

              <p className="text-slate-500 mt-2 max-w-xl">
                Write about what you learn, share your knowledge,
                and explore blogs from other students.
              </p>
            </div>

          </div>


          <button
            onClick={() => navigate("/user/create-blog")}
            className="flex items-center justify-center gap-2 bg-purple-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-purple-700 transition shadow-sm"
          >
            <PenLine size={18} />
            Create Blog
          </button>

        </div>

      </div>


      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">

        {/* My Blogs */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                My Blogs
              </p>

              <h2 className="text-xl font-bold text-slate-800 mt-2">
                Manage Blogs
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                View and manage your posts
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileText size={23} />
            </div>

          </div>
        </div>


        {/* Community Blogs */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Community
              </p>

              <h2 className="text-xl font-bold text-slate-800 mt-2">
                Explore Blogs
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                Read blogs from students
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen size={23} />
            </div>

          </div>
        </div>


        {/* Account */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Account
              </p>

              <h2 className="text-xl font-bold text-slate-800 mt-2">
                Active
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                Student account
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <CircleCheck size={23} />
            </div>

          </div>
        </div>

      </div>


      {/* Quick Actions */}
      <div className="mb-8">

        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-800">
            Quick Actions
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Access your most frequently used student features.
          </p>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Create Blog */}
          <button
            onClick={() => navigate("/user/create-blog")}
            className="bg-white border border-slate-200 rounded-2xl p-6 text-left hover:border-purple-300 hover:shadow-md transition group"
          >
            <div className="flex items-center justify-between mb-6">

              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <PenLine size={23} />
              </div>

              <ArrowRight
                size={20}
                className="text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition"
              />

            </div>

            <h3 className="text-lg font-bold text-slate-800">
              Create Blog
            </h3>

            <p className="text-slate-500 text-sm mt-2">
              Share your ideas, knowledge, and experiences.
            </p>
          </button>


          {/* My Blogs */}
          <button
            onClick={() => navigate("/user/my-blogs")}
            className="bg-white border border-slate-200 rounded-2xl p-6 text-left hover:border-indigo-300 hover:shadow-md transition group"
          >
            <div className="flex items-center justify-between mb-6">

              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FileText size={23} />
              </div>

              <ArrowRight
                size={20}
                className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition"
              />

            </div>

            <h3 className="text-lg font-bold text-slate-800">
              My Blogs
            </h3>

            <p className="text-slate-500 text-sm mt-2">
              View, edit, and manage your published blogs.
            </p>
          </button>


          {/* Explore Blogs */}
          <button
            onClick={() => navigate("/blogs")}
            className="bg-white border border-slate-200 rounded-2xl p-6 text-left hover:border-blue-300 hover:shadow-md transition group"
          >
            <div className="flex items-center justify-between mb-6">

              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <BookOpen size={23} />
              </div>

              <ArrowRight
                size={20}
                className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition"
              />

            </div>

            <h3 className="text-lg font-bold text-slate-800">
              Explore Blogs
            </h3>

            <p className="text-slate-500 text-sm mt-2">
              Read and discover blogs from the community.
            </p>
          </button>

        </div>
      </div>


      {/* Profile Summary */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h3 className="font-bold text-slate-800">
                {user?.name}
              </h3>

              <p className="text-sm text-slate-500">
                {user?.email}
              </p>
            </div>

          </div>


          <button
            onClick={() => navigate("/user/profile")}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
          >
            <User size={17} />
            View Profile
            <ArrowRight size={16} />
          </button>

        </div>

      </div>

    </div>
  );
};

export default UserD;