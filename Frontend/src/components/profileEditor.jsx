import React, { useState } from "react";
import { useAuth } from "../context/authContext";
import { updateProfile, changePassword } from "../services/authService";

import {
  User,
  Mail,
  ShieldCheck,
  CircleCheck,
  Pencil,
  Save,
  X,
  Lock,
  Eye,
  EyeOff,
  CalendarDays,
  KeyRound,
} from "lucide-react";

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition";

const Banner = ({ message }) => {
  if (!message) return null;

  const ok = message.type === "success";

  return (
    <div
      className={`mb-5 p-3 rounded-xl border text-sm ${
        ok
          ? "bg-green-50 border-green-200 text-green-700"
          : "bg-red-50 border-red-200 text-red-600"
      }`}
    >
      {message.text}
    </div>
  );
};

/*
  Props
  - title:      small label above the page title, e.g. "Student Profile"
  - badgeLabel: text inside the role badge, e.g. "Student"
  - badgeIcon:  lucide icon component for the badge
  - stats:      [{ label, value, icon }]  (role specific numbers)
*/
const ProfileEditor = ({
  title,
  badgeLabel,
  badgeIcon,
  stats = [],
}) => {
  const { user, token, updateUser } = useAuth();

  const BadgeIcon = badgeIcon || ShieldCheck;

  // ---------- Profile edit ----------
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);

  const startEdit = () => {
    setForm({
      name: user?.name || "",
      email: user?.email || "",
    });
    setProfileMsg(null);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setProfileMsg(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setProfileMsg(null);

    if (!form.name.trim()) {
      setProfileMsg({ type: "error", text: "Name cannot be empty" });
      return;
    }

    setSaving(true);

    try {
      const data = await updateProfile(
        { name: form.name.trim(), email: form.email.trim() },
        token
      );

      updateUser(data.user);

      setEditing(false);
      setProfileMsg({
        type: "success",
        text: "Profile updated successfully",
      });
    } catch (error) {
      setProfileMsg({
        type: "error",
        text:
          error.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setSaving(false);
    }
  };

  // ---------- Password ----------
  const [pw, setPw] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState(null);

  const handlePassword = async (e) => {
    e.preventDefault();
    setPwMsg(null);

    if (pw.next.length < 6) {
      setPwMsg({
        type: "error",
        text: "New password must be at least 6 characters",
      });
      return;
    }

    if (pw.next !== pw.confirm) {
      setPwMsg({ type: "error", text: "Passwords do not match" });
      return;
    }

    setPwSaving(true);

    try {
      await changePassword(
        { currentPassword: pw.current, newPassword: pw.next },
        token
      );

      setPw({ current: "", next: "", confirm: "" });
      setPwMsg({
        type: "success",
        text: "Password changed successfully",
      });
    } catch (error) {
      setPwMsg({
        type: "error",
        text:
          error.response?.data?.message || "Failed to change password",
      });
    } finally {
      setPwSaving(false);
    }
  };

  const joined = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <p className="text-indigo-600 text-sm font-semibold uppercase tracking-wide">
          {title}
        </p>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mt-2">
          My Profile
        </h1>

        <p className="text-slate-500 mt-2">
          View and manage your account information.
        </p>
      </div>


      {/* Stats */}
      {stats.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between"
              >
                <div>
                  <p className="text-sm text-slate-500">
                    {stat.label}
                  </p>

                  <h2 className="text-2xl font-bold text-slate-800 mt-1.5">
                    {stat.value}
                  </h2>
                </div>

                <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Icon size={21} />
                </div>
              </div>
            );
          })}
        </div>
      )}


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Identity card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          <div className="bg-indigo-50 border-b border-indigo-100 p-6 text-center">

            <div className="w-20 h-20 mx-auto rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-3xl font-bold shadow-sm shadow-indigo-600/20">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>

            <h2 className="text-xl font-bold text-slate-800 mt-4 wrap-break-words">
              {user?.name}
            </h2>

            <p className="text-sm text-slate-500 mt-1 break-all">
              {user?.email}
            </p>

            <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full bg-white border border-indigo-200 text-indigo-700 text-sm font-semibold">
              <BadgeIcon size={15} />
              {badgeLabel}
            </div>

          </div>

          <div className="p-5 space-y-3 text-sm">

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-500">
                <CircleCheck size={16} className="text-green-600" />
                Status
              </span>

              <span className="font-semibold text-green-600">
                Active
              </span>
            </div>

            {joined && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-500">
                  <CalendarDays size={16} className="text-slate-400" />
                  Member since
                </span>

                <span className="font-semibold text-slate-700">
                  {joined}
                </span>
              </div>
            )}

          </div>

        </div>


        {/* Right side */}
        <div className="lg:col-span-2 space-y-6">

          {/* Personal information */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">

            <div className="flex items-center justify-between mb-5">

              <h3 className="text-lg font-bold text-slate-800">
                Personal Information
              </h3>

              {!editing && (
                <button
                  onClick={startEdit}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition"
                >
                  <Pencil size={14} />
                  Edit
                </button>
              )}

            </div>

            <Banner message={profileMsg} />

            <form onSubmit={handleSave} className="space-y-5">

              {/* Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <User size={15} className="text-slate-400" />
                  Full Name
                </label>

                {editing ? (
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className={inputClass}
                    required
                  />
                ) : (
                  <p className="px-4 py-2.5 rounded-xl bg-slate-50 text-slate-800 font-medium">
                    {user?.name || "—"}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Mail size={15} className="text-slate-400" />
                  Email Address
                </label>

                {editing ? (
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className={inputClass}
                    required
                  />
                ) : (
                  <p className="px-4 py-2.5 rounded-xl bg-slate-50 text-slate-800 font-medium break-all">
                    {user?.email || "—"}
                  </p>
                )}
              </div>

              {/* Role (read only) */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <ShieldCheck size={15} className="text-slate-400" />
                  Role
                </label>

                <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-50">
                  <span className="text-slate-800 font-medium capitalize">
                    {user?.role}
                  </span>

                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Lock size={13} />
                    Only an admin can change roles
                  </span>
                </div>
              </div>

              {editing && (
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">

                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition"
                  >
                    <X size={16} />
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow-sm shadow-indigo-600/20 disabled:opacity-60"
                  >
                    <Save size={16} />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>

                </div>
              )}

            </form>

          </div>


          {/* Change password */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">

            <div className="flex items-center gap-3 mb-5">

              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <KeyRound size={19} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Change Password
                </h3>

                <p className="text-sm text-slate-500">
                  Use at least 6 characters.
                </p>
              </div>

            </div>

            <Banner message={pwMsg} />

            <form onSubmit={handlePassword} className="space-y-4">

              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Current password"
                  value={pw.current}
                  onChange={(e) =>
                    setPw({ ...pw, current: e.target.value })
                  }
                  className={`${inputClass} pr-12`}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPw((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition"
                  aria-label={
                    showPw ? "Hide passwords" : "Show passwords"
                  }
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <input
                  type={showPw ? "text" : "password"}
                  placeholder="New password"
                  value={pw.next}
                  onChange={(e) =>
                    setPw({ ...pw, next: e.target.value })
                  }
                  className={inputClass}
                  required
                />

                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={pw.confirm}
                  onChange={(e) =>
                    setPw({ ...pw, confirm: e.target.value })
                  }
                  className={inputClass}
                  required
                />

              </div>

              <div className="flex sm:justify-end pt-1">
                <button
                  type="submit"
                  disabled={pwSaving}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow-sm shadow-indigo-600/20 disabled:opacity-60 w-full sm:w-auto"
                >
                  <Lock size={16} />
                  {pwSaving ? "Updating..." : "Update Password"}
                </button>
              </div>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ProfileEditor;