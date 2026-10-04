import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { getStudents } from "../../services/authService";
import { getBlogs } from "../../services/blogService";

import {
  Search,
  Users,
  FileText,
  ChevronDown,
  ArrowRight,
  GraduationCap,
  PenLine,
} from "lucide-react";

const TABS = [
  { key: "all", label: "All" },
  { key: "active", label: "Writing" },
  { key: "none", label: "No blogs yet" },
];

const StudentDetails = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [students, setStudents] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentData, blogData] = await Promise.all([
          getStudents(token),
          getBlogs(token),
        ]);

        setStudents(studentData.students || []);
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

  // Every student, with the blogs they wrote (can be empty)
  const rows = useMemo(() => {
    const blogsByAuthor = new Map();

    blogs.forEach((blog) => {
      const authorId = blog.author?._id;

      if (!authorId) return;

      if (!blogsByAuthor.has(authorId)) {
        blogsByAuthor.set(authorId, []);
      }

      blogsByAuthor.get(authorId).push(blog);
    });

    return students
      .map((student) => ({
        ...student,
        blogs: blogsByAuthor.get(student._id) || [],
      }))
      .sort(
        (a, b) =>
          b.blogs.length - a.blogs.length ||
          (a.name || "").localeCompare(b.name || "")
      );
  }, [students, blogs]);

  const activeCount = rows.filter((s) => s.blogs.length > 0).length;
  const noBlogCount = rows.length - activeCount;
  const totalBlogs = rows.reduce((sum, s) => sum + s.blogs.length, 0);

  const countFor = (key) =>
    key === "all" ? rows.length : key === "active" ? activeCount : noBlogCount;

  const filteredRows = rows.filter((student) => {
    const value = search.trim().toLowerCase();

    const matchesSearch =
      student.name?.toLowerCase().includes(value) ||
      student.email?.toLowerCase().includes(value);

    const matchesTab =
      tab === "all" ||
      (tab === "active" && student.blogs.length > 0) ||
      (tab === "none" && student.blogs.length === 0);

    return matchesSearch && matchesTab;
  });

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const show = (value) => (loading ? "—" : value);

  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <p className="text-indigo-600 text-sm font-semibold uppercase tracking-wide">
          Students
        </p>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mt-2">
          Student Details
        </h1>

        <p className="text-slate-500 mt-2">
          See every student, who is writing, and read their blogs.
        </p>
      </div>


      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">

        {[
          {
            label: "Total Students",
            value: show(rows.length),
            hint: "Registered students",
            icon: Users,
          },
          {
            label: "Writing Blogs",
            value: show(activeCount),
            hint: "Posted at least one blog",
            icon: PenLine,
          },
          {
            label: "Total Blogs",
            value: show(totalBlogs),
            hint: "Written by students",
            icon: FileText,
          },
        ].map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    {stat.label}
                  </p>

                  <h2 className="text-3xl font-bold text-slate-800 mt-2">
                    {stat.value}
                  </h2>

                  <p className="text-xs text-slate-400 mt-1">
                    {stat.hint}
                  </p>
                </div>

                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Icon size={23} />
                </div>

              </div>
            </div>
          );
        })}

      </div>


      {/* Student List */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        {/* List Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 space-y-4">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <div>
              <h2 className="text-lg font-bold text-slate-800">
                All Students
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Click a student to see their blogs.
              </p>
            </div>

            <div className="relative sm:w-64">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or email..."
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>

          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-semibold transition ${
                  tab === t.key
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
                    : "bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                }`}
              >
                {t.label}

                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    tab === t.key
                      ? "bg-white/20 text-white"
                      : "bg-white text-slate-500"
                  }`}
                >
                  {show(countFor(t.key))}
                </span>
              </button>
            ))}
          </div>

        </div>


        {/* Rows */}
        {loading ? (

          <div className="p-10 text-center text-slate-500">
            Loading students...
          </div>

        ) : filteredRows.length === 0 ? (

          <div className="p-12 text-center">

            <div className="w-14 h-14 mx-auto rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <GraduationCap size={26} />
            </div>

            <h3 className="font-semibold text-slate-700 mt-4">
              {search || tab !== "all"
                ? "No student found"
                : "No students yet"}
            </h3>

            <p className="text-sm text-slate-400 mt-1">
              {search || tab !== "all"
                ? "Try a different search or filter."
                : "Students will appear here after they register."}
            </p>

          </div>

        ) : (

          filteredRows.map((student) => {
            const isOpen = openId === student._id;
            const hasBlogs = student.blogs.length > 0;

            return (
              <div
                key={student._id}
                className="border-b border-slate-100 last:border-b-0"
              >

                {/* Student Row */}
                <button
                  onClick={() => toggle(student._id)}
                  className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 text-left hover:bg-slate-50 transition"
                >

                  <div className="flex items-center gap-3 min-w-0">

                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                      {student.name?.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 truncate">
                        {student.name}
                      </p>

                      <p className="text-xs text-slate-400 truncate">
                        {student.email}
                      </p>
                    </div>

                  </div>


                  <div className="flex items-center gap-4 shrink-0">

                    {student.createdAt && (
                      <span className="hidden md:block text-xs text-slate-400">
                        Joined{" "}
                        {new Date(student.createdAt).toLocaleDateString()}
                      </span>
                    )}

                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        hasBlogs
                          ? "bg-indigo-50 text-indigo-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {hasBlogs
                        ? `${student.blogs.length} blog${
                            student.blogs.length !== 1 ? "s" : ""
                          }`
                        : "No blogs"}
                    </span>

                    <ChevronDown
                      size={18}
                      className={`text-slate-400 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />

                  </div>

                </button>


                {/* Student's Blogs */}
                {isOpen && (
                  <div className="bg-slate-50 px-5 sm:px-6 py-3 border-t border-slate-100">

                    {!hasBlogs ? (

                      <p className="py-4 text-sm text-slate-500 text-center">
                        {student.name} hasn't posted any blog yet.
                      </p>

                    ) : (

                      student.blogs.map((blog) => (

                        <div
                          key={blog._id}
                          className="flex items-center justify-between gap-4 py-3 border-b border-slate-200 last:border-b-0"
                        >

                          <div className="flex items-center gap-3 min-w-0">

                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-indigo-600 flex items-center justify-center shrink-0">
                              <FileText size={16} />
                            </div>

                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-800 truncate">
                                {blog.title}
                              </p>

                              <p className="text-xs text-slate-400">
                                {new Date(
                                  blog.createdAt
                                ).toLocaleDateString()}
                              </p>
                            </div>

                          </div>


                          <button
                            onClick={() =>
                              navigate(`/blogs/${blog._id}`, {
                                state: { from: "/teacher/students" },
                              })
                            }
                            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 shrink-0 transition"
                          >
                            View
                            <ArrowRight size={14} />
                          </button>

                        </div>

                      ))

                    )}

                  </div>
                )}

              </div>
            );
          })

        )}

      </div>

    </div>
  );
};

export default StudentDetails;