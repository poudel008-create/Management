
import React from "react";
import { useAuth } from "../../context/authContext";
import {
  User,
  Mail,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  CalendarDays,
} from "lucide-react";

const TeacherProfile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <p className="text-emerald-600 text-sm font-semibold uppercase tracking-wide">
          Teacher Profile
        </p>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mt-2">
          My Profile
        </h1>

        <p className="text-slate-500 mt-2">
          View your account and teacher information.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        {/* Top Section */}
        <div className="bg-emerald-50 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">

            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <User size={38} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                {user?.name || "Teacher"}
              </h2>

              <p className="text-slate-500 mt-1">
                {user?.email || "No email available"}
              </p>

              <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full bg-white border border-emerald-200 text-emerald-700 text-sm font-semibold">
                <ShieldCheck size={16} />
                Teacher
              </div>
            </div>

          </div>
        </div>

        {/* Information */}
        <div className="p-6 sm:p-8">

          <h3 className="text-lg font-bold text-slate-800 mb-5">
            Account Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Name */}
            <div className="border border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <User size={19} />
                </div>

                <p className="text-sm text-slate-500">
                  Full Name
                </p>
              </div>

              <p className="font-semibold text-slate-800">
                {user?.name || "Not available"}
              </p>
            </div>

            {/* Email */}
            <div className="border border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Mail size={19} />
                </div>

                <p className="text-sm text-slate-500">
                  Email Address
                </p>
              </div>

              <p className="font-semibold text-slate-800 break-all">
                {user?.email || "Not available"}
              </p>
            </div>

            {/* Role */}
            <div className="border border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <GraduationCap size={19} />
                </div>

                <p className="text-sm text-slate-500">
                  Role
                </p>
              </div>

              <p className="font-semibold text-slate-800 capitalize">
                {user?.role || "Teacher"}
              </p>
            </div>

            {/* Account Status */}
            <div className="border border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                  <ShieldCheck size={19} />
                </div>

                <p className="text-sm text-slate-500">
                  Account Status
                </p>
              </div>

              <p className="font-semibold text-emerald-600">
                Active
              </p>
            </div>

          </div>

          {/* Teacher Section */}
          <div className="mt-8">

            <h3 className="text-lg font-bold text-slate-800 mb-5">
              Teacher Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="border border-slate-200 rounded-xl p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <BookOpen size={21} />
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Dashboard Access
                  </p>

                  <p className="font-semibold text-slate-800 mt-1">
                    Student Blogs & Activity
                  </p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                  <CalendarDays size={21} />
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Account Type
                  </p>

                  <p className="font-semibold text-slate-800 mt-1">
                    Teacher Account
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;

