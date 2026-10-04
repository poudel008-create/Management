import React, { useEffect, useState } from "react";
import { Search, RefreshCw, Mail, CalendarDays, Users } from "lucide-react";
import { useAuth } from "../../context/authContext";
import { getAllUsers } from "../../services/authService";

const TABS = [
  { key: "all", label: "All" },
  { key: "student", label: "Students" },
  { key: "teacher", label: "Teachers" },
  { key: "admin", label: "Admins" },
];

const rolePill = (role) => {
  if (role === "admin") return "bg-slate-800 text-white";
  if (role === "teacher") return "bg-indigo-600 text-white";
  return "bg-indigo-50 text-indigo-700";
};

const UsersDetails = () => {
  const { token } = useAuth();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
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

  const countFor = (key) =>
    key === "all"
      ? users.length
      : users.filter((u) => u.role === key).length;

  const filteredUsers = users.filter((u) => {
    const value = search.toLowerCase();

    const matchesTab = tab === "all" || u.role === tab;

    const matchesSearch =
      u.name?.toLowerCase().includes(value) ||
      u.email?.toLowerCase().includes(value);

    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <p className="text-indigo-600 text-sm font-semibold uppercase tracking-wide">
          Admin Panel
        </p>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mt-2">
          Users
        </h1>

        <p className="text-slate-500 mt-2">
          Everyone who has joined the platform.
        </p>
      </div>


      {/* Tabs + Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">

        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition ${
                tab === t.key
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
              }`}
            >
              {t.label}

              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  tab === t.key
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {loading ? "—" : countFor(t.key)}
              </span>
            </button>
          ))}
        </div>

        <div className="flex gap-3">

          <div className="relative flex-1 lg:w-72">
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

      </div>


      {/* Users */}
      {loading ? (

        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
          Loading users...
        </div>

      ) : filteredUsers.length === 0 ? (

        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">

          <div className="w-14 h-14 mx-auto rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users size={26} />
          </div>

          <h3 className="font-semibold text-slate-700 mt-4">
            No users found
          </h3>

          <p className="text-sm text-slate-400 mt-1">
            Try a different search or filter.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

          {filteredUsers.map((u) => (

            <div
              key={u._id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-indigo-300 hover:shadow-md transition text-center"
            >

              <div className="w-16 h-16 mx-auto rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl font-bold">
                {u.name?.charAt(0).toUpperCase()}
              </div>

              <h3 className="font-bold text-slate-800 mt-4 truncate">
                {u.name}
              </h3>

              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold capitalize ${rolePill(
                  u.role
                )}`}
              >
                {u.role}
              </span>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-left">

                <div className="flex items-center gap-2 text-xs text-slate-500 min-w-0">
                  <Mail size={14} className="shrink-0 text-slate-400" />
                  <span className="truncate">{u.email}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CalendarDays size={14} className="shrink-0 text-slate-400" />
                  Joined{" "}
                  {u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString()
                    : "—"}
                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default UsersDetails;