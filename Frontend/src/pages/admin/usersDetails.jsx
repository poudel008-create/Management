
import React, { useEffect, useState } from "react";
import {
  Users,
  User,
  Mail,
  ShieldCheck,
  GraduationCap,
  Search,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../../context/authContext";
import { getAllUsers } from "../../services/authService";

const UsersDetails = () => {
  const { token } = useAuth();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

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

  const filteredUsers = users.filter((user) => {
    const value = search.toLowerCase();

    return (
      user.name?.toLowerCase().includes(value) ||
      user.email?.toLowerCase().includes(value) ||
      user.role?.toLowerCase().includes(value)
    );
  });

  const getRoleStyle = (role) => {
    if (role === "admin") {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }

    if (role === "teacher") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    return "bg-purple-50 text-purple-700 border-purple-200";
  };

  const getRoleIcon = (role) => {
    if (role === "admin") {
      return <ShieldCheck size={15} />;
    }

    if (role === "teacher") {
      return <GraduationCap size={15} />;
    }

    return <User size={15} />;
  };

  return (
    <div className="max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide">
          Admin Panel
        </p>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mt-2">
          Users
        </h1>

        <p className="text-slate-500 mt-2">
          View and monitor all registered users.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">

        {/* Total */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Total Users
              </p>

              <h2 className="text-3xl font-bold text-slate-800 mt-2">
                {loading ? "—" : users.length}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={22} />
            </div>

          </div>
        </div>

        {/* Teachers */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Teachers
              </p>

              <h2 className="text-3xl font-bold text-slate-800 mt-2">
                {loading
                  ? "—"
                  : users.filter((user) => user.role === "teacher").length}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <GraduationCap size={22} />
            </div>

          </div>
        </div>

        {/* Students */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Students
              </p>

              <h2 className="text-3xl font-bold text-slate-800 mt-2">
                {loading
                  ? "—"
                  : users.filter((user) => user.role === "student").length}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <User size={22} />
            </div>

          </div>
        </div>

      </div>

      {/* Search + Refresh */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 mb-6">

        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">

          <div className="relative w-full sm:max-w-md">

            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search by name, email or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

          <button
            onClick={fetchUsers}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>

        </div>

      </div>

      {/* Users List */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        {/* Desktop Header */}
        <div className="hidden md:grid grid-cols-[1.2fr_1.5fr_180px] gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
          <span>User</span>
          <span>Email</span>
          <span>Role</span>
        </div>

        {loading ? (

          <div className="p-12 text-center text-slate-500">
            Loading users...
          </div>

        ) : filteredUsers.length === 0 ? (

          <div className="p-12 text-center">

            <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
              <Users size={26} />
            </div>

            <h3 className="font-semibold text-slate-700 mt-4">
              No users found
            </h3>

            <p className="text-sm text-slate-400 mt-1">
              Try a different search.
            </p>

          </div>

        ) : (

          filteredUsers.map((user) => (

            <div
              key={user._id}
              className="grid grid-cols-1 md:grid-cols-[1.2fr_1.5fr_180px] gap-4 items-center px-6 py-5 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition"
            >

              {/* User */}
              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <User size={20} />
                </div>

                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 truncate">
                    {user.name}
                  </p>

                  <p className="text-xs text-slate-400 md:hidden truncate">
                    {user.email}
                  </p>
                </div>

              </div>

              {/* Email */}
              <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 min-w-0">
                <Mail size={16} className="shrink-0" />
                <span className="truncate">
                  {user.email}
                </span>
              </div>

              {/* Role */}
              <div>

                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold capitalize ${getRoleStyle(
                    user.role
                  )}`}
                >
                  {getRoleIcon(user.role)}
                  {user.role}
                </span>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
};

export default UsersDetails;
