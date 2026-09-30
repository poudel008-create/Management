import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import {
  getAllUsers,
  updateUserRole,
} from "../../services/authService";

import {
  Users,
  GraduationCap,
  UserCog,
  ShieldCheck,
  CalendarDays,
} from "lucide-react";

const AdminD = () => {
  const { token, user } = useAuth();

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers(token);
        setUsers(data.users);
      } catch (error) {
        console.log(error);
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [token]);

  const handleRoleChange = async (userId, role) => {
    try {
      const data = await updateUserRole(userId, role, token);

      setUsers((prevUsers) =>
        prevUsers.map((listedUser) =>
          listedUser._id === userId
            ? {
                ...listedUser,
                role: data.user.role,
              }
            : listedUser
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const studentCount = users.filter(
    (user) => user.role === "student"
  ).length;

  const teacherCount = users.filter(
    (user) => user.role === "teacher"
  ).length;

  return (
    <div className="max-w-7xl mx-auto">

      {/* Page Header */}
      <div className="mb-8">

        <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide">
          Admin Dashboard
        </p>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mt-2">
          Welcome, {user?.name}
        </h1>

        <p className="text-slate-500 mt-2">
          Manage users and their roles from your administration panel.
        </p>

      </div>


      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">

        {/* Total Users */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Total Users
              </p>

              <h2 className="text-3xl font-bold text-slate-800 mt-2">
                {users.length}
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                Registered users
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={24} />
            </div>

          </div>

        </div>


        {/* Students */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Students
              </p>

              <h2 className="text-3xl font-bold text-slate-800 mt-2">
                {studentCount}
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                Student accounts
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <GraduationCap size={24} />
            </div>

          </div>

        </div>


        {/* Teachers */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Teachers
              </p>

              <h2 className="text-3xl font-bold text-slate-800 mt-2">
                {teacherCount}
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                Teacher accounts
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <UserCog size={24} />
            </div>

          </div>

        </div>

      </div>


      {/* User Management */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        {/* Section Header */}
        <div className="p-6 sm:p-7 border-b border-slate-200">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShieldCheck size={22} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  User Management
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  View users and manage their account roles.
                </p>
              </div>

            </div>

            <div className="text-sm text-slate-500">
              {users.length} user{users.length !== 1 ? "s" : ""}
            </div>

          </div>

        </div>


        {/* Table Header */}
        <div className="hidden md:grid grid-cols-4 gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200">

          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            User
          </p>

          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Email
          </p>

          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Role
          </p>

          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Joined
          </p>

        </div>


        {/* Users */}
        <div>

          {users.length === 0 ? (

            <div className="p-12 text-center">

              <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                <Users size={26} />
              </div>

              <h3 className="font-semibold text-slate-700 mt-4">
                No users found
              </h3>

              <p className="text-sm text-slate-400 mt-1">
                Registered users will appear here.
              </p>

            </div>

          ) : (

            users.map((listedUser) => (

              <div
                key={listedUser._id}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 px-6 py-5 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition"
              >

                {/* User */}
                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    {listedUser.name?.charAt(0).toUpperCase()}
                  </div>

                  <div>

                    <p className="font-semibold text-slate-800">
                      {listedUser.name}
                    </p>

                    <p className="text-xs text-slate-400 md:hidden mt-1">
                      {listedUser.email}
                    </p>

                  </div>

                </div>


                {/* Email */}
                <div className="hidden md:flex items-center text-sm text-slate-600 break-all">
                  {listedUser.email}
                </div>


                {/* Role */}
                <div className="flex items-center">

                  <select
                    value={listedUser.role}
                    onChange={(e) =>
                      handleRoleChange(
                        listedUser._id,
                        e.target.value
                      )
                    }
                    className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer"
                  >

                    <option value="student">
                      Student
                    </option>

                    <option value="teacher">
                      Teacher
                    </option>

                  </select>

                </div>


                {/* Joined */}
                <div className="flex items-center gap-2 text-sm text-slate-500">

                  <CalendarDays size={16} />

                  {listedUser.createdAt
                    ? new Date(
                        listedUser.createdAt
                      ).toLocaleDateString()
                    : "—"}

                </div>

              </div>

            ))

          )}

        </div>

      </div>

    </div>
  );
};

export default AdminD;