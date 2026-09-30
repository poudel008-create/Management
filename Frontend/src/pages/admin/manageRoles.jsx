
import React, { useEffect, useState } from "react";
import {
  ShieldCheck,
  User,
  GraduationCap,
  Search,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../../context/authContext";
import { getAllUsers,updateUserRole } from "../../services/authService";

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

      await updateUserRole(userId, role, token);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId
            ? { ...user, role }
            : user
        )
      );
    } catch (error) {
      console.log("UPDATE ROLE ERROR:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const value = search.toLowerCase();

    return (
      user.name?.toLowerCase().includes(value) ||
      user.email?.toLowerCase().includes(value)
    );
  });

  const getRoleStyle = (role) => {
    if (role === "teacher") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (role === "student") {
      return "bg-purple-50 text-purple-700 border-purple-200";
    }

    return "bg-blue-50 text-blue-700 border-blue-200";
  };

  return (
    <div className="max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide">
          Admin Panel
        </p>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mt-2">
          Manage Roles
        </h1>

        <p className="text-slate-500 mt-2">
          Manage user roles and control access to different dashboards.
        </p>
      </div>

      {/* Top Actions */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 mb-6">

        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">

          {/* Search */}
          <div className="relative w-full sm:max-w-md">

            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

          {/* Refresh */}
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

      {/* Users */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        {/* Table Header */}
        <div className="hidden md:grid grid-cols-[1fr_1.5fr_180px_120px] gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
          <span>User</span>
          <span>Email</span>
          <span>Current Role</span>
          <span>Action</span>
        </div>

        {loading ? (

          <div className="p-12 text-center text-slate-500">
            Loading users...
          </div>

        ) : filteredUsers.length === 0 ? (

          <div className="p-12 text-center">

            <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
              <User size={26} />
            </div>

            <h3 className="font-semibold text-slate-700 mt-4">
              No users found
            </h3>

            <p className="text-sm text-slate-400 mt-1">
              Try searching with a different name or email.
            </p>

          </div>

        ) : (

          <div>

            {filteredUsers.map((user) => (

              <div
                key={user._id}
                className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr_180px_120px] gap-4 items-center px-6 py-5 border-b border-slate-100 last:border-b-0"
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
                <p className="hidden md:block text-sm text-slate-500 truncate">
                  {user.email}
                </p>

                {/* Role */}
                <div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold capitalize ${getRoleStyle(
                      user.role
                    )}`}
                  >

                    {user.role === "teacher" ? (
                      <GraduationCap size={14} />
                    ) : user.role === "student" ? (
                      <User size={14} />
                    ) : (
                      <ShieldCheck size={14} />
                    )}

                    {user.role}

                  </span>

                </div>

                {/* Action */}
                <div>

                  {user.role === "admin" ? (

                    <span className="text-xs font-semibold text-slate-400">
                      Protected
                    </span>

                  ) : (

                    <select
                      value={user.role}
                      disabled={updatingId === user._id}
                      onChange={(e) =>
                        handleRoleChange(
                          user._id,
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
                    >

                      <option value="student">
                        Student
                      </option>

                      <option value="teacher">
                        Teacher
                      </option>

                    </select>

                  )}

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
};

export default ManageRoles;
