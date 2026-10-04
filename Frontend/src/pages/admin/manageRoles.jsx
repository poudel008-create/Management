import React, { useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  GraduationCap,
  UserCog,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../context/authContext";
import { getAllUsers, updateUserRole } from "../../services/authService";

const ManageRoles = () => {
  const { token } = useAuth();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const data = await getAllUsers(token);

      setUsers(data.users || []);
    } catch (error) {
      console.log("FETCH USERS ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const handleRoleChange = async (userId, role) => {
    try {
      setUpdatingId(userId);

      await updateUserRole({userId, role, token});

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u._id === userId ? { ...u, role } : u
        )
      );
    } catch (error) {
      console.log("UPDATE ROLE ERROR:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const matchesSearch = (u) => {
    const value = search.toLowerCase();

    return (
      u.name?.toLowerCase().includes(value) ||
      u.email?.toLowerCase().includes(value)
    );
  };

  const students = users.filter(
    (u) => u.role === "student" && matchesSearch(u)
  );

  const teachers = users.filter(
    (u) => u.role === "teacher" && matchesSearch(u)
  );

  const adminCount = users.filter((u) => u.role === "admin").length;

  const renderRow = (u, targetRole) => {
    const promoting = targetRole === "teacher";

    return (
      <div
        key={u._id}
        className="flex items-center justify-between gap-3 px-5 py-3.5 border-t border-slate-100"
      >

        <div className="flex items-center gap-3 min-w-0">

          <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold shrink-0">
            {u.name?.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {u.name}
            </p>

            <p className="text-xs text-slate-400 truncate">
              {u.email}
            </p>
          </div>

        </div>

        <button
          onClick={() => handleRoleChange(u._id, targetRole)}
          disabled={updatingId === u._id}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition disabled:opacity-60 ${
            promoting
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {updatingId === u._id ? (
            "Updating..."
          ) : promoting ? (
            <>
              Make teacher
              <ArrowRight size={14} />
            </>
          ) : (
            <>
              <ArrowLeft size={14} />
              Make student
            </>
          )}
        </button>

      </div>
    );
  };

  const emptyRow = (text) => (
    <p className="px-5 py-8 border-t border-slate-100 text-center text-sm text-slate-400">
      {loading ? "Loading..." : text}
    </p>
  );

  return (
    <div className="max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <p className="text-indigo-600 text-sm font-semibold uppercase tracking-wide">
          Admin Panel
        </p>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mt-2">
          Manage Roles
        </h1>

        <p className="text-slate-500 mt-2">
          Move people between roles. Changes apply right away.
        </p>
      </div>


      {/* Search + Refresh */}
      <div className="flex gap-3 mb-6">

        <div className="relative flex-1 sm:max-w-md">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
          />
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center justify-center w-11 rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-indigo-300 hover:text-indigo-600 transition disabled:opacity-60"
          aria-label="Refresh"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />
        </button>

      </div>


      {/* Board */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* Students */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          <div className="flex items-center justify-between p-5">

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <GraduationCap size={21} />
              </div>

              <div>
                <h2 className="font-bold text-slate-800">
                  Students
                </h2>

                <p className="text-xs text-slate-400">
                  Can write and manage blogs
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
              {students.length}
            </span>

          </div>

          {students.length === 0
            ? emptyRow("No students found.")
            : students.map((u) => renderRow(u, "teacher"))}

        </div>


        {/* Teachers */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          <div className="flex items-center justify-between p-5">

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                <UserCog size={21} />
              </div>

              <div>
                <h2 className="font-bold text-slate-800">
                  Teachers
                </h2>

                <p className="text-xs text-slate-400">
                  Can view all student blogs
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-indigo-600 text-white text-xs font-semibold">
              {teachers.length}
            </span>

          </div>

          {teachers.length === 0
            ? emptyRow("No teachers found.")
            : teachers.map((u) => renderRow(u, "student"))}

        </div>

      </div>


      {/* Admin note */}
      <div className="flex items-center gap-3 mt-6 p-4 rounded-xl bg-slate-100 text-sm text-slate-600">
        <ShieldCheck size={18} className="text-slate-500 shrink-0" />

        {loading
          ? "Loading..."
          : `${adminCount} admin account${
              adminCount !== 1 ? "s are" : " is"
            } protected and can't be changed here.`}
      </div>

    </div>
  );
};

export default ManageRoles;