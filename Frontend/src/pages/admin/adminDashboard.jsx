import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { getAllUsers } from "../../services/authService";
import { getBlogs } from "../../services/blogService";

import {
  Users,
  GraduationCap,
  UserCog,
  BookOpen,
  ArrowRight,
  FileText,
} from "lucide-react";

const StatCard = ({ title, value, hint, icon: Icon }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
    <div className="flex items-center justify-between">

      <div>
        <p className="text-sm text-slate-500">{title}</p>

        <h2 className="text-3xl font-bold text-slate-800 mt-2">
          {value}
        </h2>

        <p className="text-xs text-slate-400 mt-1">{hint}</p>
      </div>

      <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
        <Icon size={23} />
      </div>

    </div>
  </div>
);

const rolePill = (role) => {
  if (role === "admin") return "bg-slate-800 text-white";
  if (role === "teacher") return "bg-indigo-600 text-white";
  return "bg-indigo-50 text-indigo-700";
};

const AdminD = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, blogData] = await Promise.all([
          getAllUsers(token),
          getBlogs(token),
        ]);

        setUsers(userData.users || []);
        setBlogs(blogData.blogs || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  const studentCount = users.filter((u) => u.role === "student").length;
  const teacherCount = users.filter((u) => u.role === "teacher").length;
  const adminCount = users.filter((u) => u.role === "admin").length;

  const percent = (count) =>
    users.length > 0 ? Math.round((count / users.length) * 100) : 0;

  const recentUsers = [...users]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    )
    .slice(0, 5);

  const recentBlogs = blogs.slice(0, 5);

  const show = (value) => (loading ? "—" : value);

  return (
    <div className="max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">

        <div>
          <p className="text-indigo-600 text-sm font-semibold uppercase tracking-wide">
            Admin Dashboard
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mt-2">
            Welcome, {user?.name}
          </h1>

          <p className="text-slate-500 mt-2">
            A quick look at your platform today.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/admin/users")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition"
          >
            <Users size={16} />
            Users
          </button>

          <button
            onClick={() => navigate("/admin/roles")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition shadow-sm shadow-indigo-600/20"
          >
            <UserCog size={16} />
            Manage Roles
          </button>
        </div>

      </div>


      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

        <StatCard
          title="Total Users"
          value={show(users.length)}
          hint="Registered accounts"
          icon={Users}
        />

        <StatCard
          title="Students"
          value={show(studentCount)}
          hint="Student accounts"
          icon={GraduationCap}
        />

        <StatCard
          title="Teachers"
          value={show(teacherCount)}
          hint="Teacher accounts"
          icon={UserCog}
        />

        <StatCard
          title="Total Blogs"
          value={show(blogs.length)}
          hint="Published so far"
          icon={BookOpen}
        />

      </div>


      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Role distribution */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">

            <h2 className="text-lg font-bold text-slate-800">
              Role Distribution
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              How your users are split.
            </p>

            <div className="flex h-3 rounded-full overflow-hidden bg-slate-100 mt-5">
              <div
                className="bg-indigo-600"
                style={{ width: `${percent(studentCount)}%` }}
              />
              <div
                className="bg-indigo-300"
                style={{ width: `${percent(teacherCount)}%` }}
              />
              <div
                className="bg-slate-400"
                style={{ width: `${percent(adminCount)}%` }}
              />
            </div>

            <div className="mt-5 space-y-3">

              {[
                { label: "Students", count: studentCount, color: "bg-indigo-600" },
                { label: "Teachers", count: teacherCount, color: "bg-indigo-300" },
                { label: "Admins", count: adminCount, color: "bg-slate-400" },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className={`w-2.5 h-2.5 rounded-full ${row.color}`} />
                    {row.label}
                  </div>

                  <p className="font-semibold text-slate-800">
                    {show(row.count)}
                    <span className="text-xs font-normal text-slate-400 ml-1.5">
                      {loading ? "" : `${percent(row.count)}%`}
                    </span>
                  </p>
                </div>
              ))}

            </div>

          </div>


          {/* Recent sign-ups */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

            <div className="flex items-center justify-between p-6 pb-4">

              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  New Sign-ups
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Latest people to join.
                </p>
              </div>

              <button
                onClick={() => navigate("/admin/users")}
                className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition"
              >
                All
                <ArrowRight size={15} />
              </button>

            </div>

            {recentUsers.length === 0 ? (
              <p className="px-6 pb-6 text-sm text-slate-400">
                {loading ? "Loading..." : "No users yet."}
              </p>
            ) : (
              recentUsers.map((u) => (
                <div
                  key={u._id}
                  className="flex items-center justify-between gap-3 px-6 py-3 border-t border-slate-100"
                >
                  <div className="flex items-center gap-3 min-w-0">

                    <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold shrink-0">
                      {u.name?.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {u.name}
                      </p>

                      <p className="text-xs text-slate-400">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString()
                          : "—"}
                      </p>
                    </div>

                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize shrink-0 ${rolePill(
                      u.role
                    )}`}
                  >
                    {u.role}
                  </span>
                </div>
              ))
            )}

          </div>

        </div>


        {/* Right column: recent blogs */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden self-start">

          <div className="flex items-center justify-between p-6 pb-4">

            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Recent Blogs
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Latest posts from the community.
              </p>
            </div>

            <button
              onClick={() => navigate("/blogs")}
              className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition"
            >
              View all
              <ArrowRight size={15} />
            </button>

          </div>

          {recentBlogs.length === 0 ? (
            <p className="px-6 pb-6 text-sm text-slate-400">
              {loading ? "Loading..." : "No blogs yet."}
            </p>
          ) : (
            recentBlogs.map((blog) => (
              <div
                key={blog._id}
                className="flex items-center justify-between gap-4 px-6 py-4 border-t border-slate-100 hover:bg-slate-50 transition"
              >

                <div className="flex items-center gap-3 min-w-0">

                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <FileText size={19} />
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 truncate">
                      {blog.title}
                    </p>

                    <p className="text-xs text-slate-400 mt-0.5">
                      {blog.author?.name || "Unknown"} •{" "}
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                </div>

                <button
                  onClick={() =>
                    navigate(`/blogs/${blog._id}`, {
                      state: { from: "/admin" },
                    })
                  }
                  className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 shrink-0 transition"
                >
                  View
                  <ArrowRight size={15} />
                </button>

              </div>
            ))
          )}

        </div>

      </div>

    </div>
  );
};

export default AdminD;