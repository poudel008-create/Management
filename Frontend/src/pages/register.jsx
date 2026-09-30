import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../services/authService";


const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
   
  });

  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await registerUser(formData);

      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Registration failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8f2] flex items-center justify-center px-6 pt-24 pb-10">

      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl overflow-hidden ">




        {/* Form */}
        <div className="p-8 md:p-12 flex items-center">

          <div className="w-full">

            <div className="text-center mb-8">



              <h1 className="text-3xl font-bold text-[#173c31] mt-8 mb-2">
                Create Account
              </h1>



            </div>


            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}


            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Name */}
              <div>

                <label className="block text-sm font-medium text-[#40554c] mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 rounded-xl bg-[#f7f8f2] border border-[#d8e1da] text-[#173c31] outline-none focus:border-[#39745c] focus:ring-2 focus:ring-[#39745c]/10 transition"
                />

              </div>


              {/* Email */}
              <div>

                <label className="block text-sm font-medium text-[#40554c] mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 rounded-xl bg-[#f7f8f2] border border-[#d8e1da] text-[#173c31] outline-none focus:border-[#39745c] focus:ring-2 focus:ring-[#39745c]/10 transition"
                />

              </div>


              {/* Password */}
              <div>

                <label className="block text-sm font-medium text-[#40554c] mb-2">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-3.5 rounded-xl bg-[#f7f8f2] border border-[#d8e1da] text-[#173c31] outline-none focus:border-[#39745c] focus:ring-2 focus:ring-[#39745c]/10 transition"
                />

              </div>


              {/* Confirm */}
              <div>

                <label className="block text-sm font-medium text-[#40554c] mb-2">
                  Confirm Password
                </label>

                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 rounded-xl bg-[#f7f8f2] border border-[#d8e1da] text-[#173c31] outline-none focus:border-[#39745c] focus:ring-2 focus:ring-[#39745c]/10 transition"
                />

              </div>

              




              {/* Register */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#164b3a] text-white font-semibold hover:bg-[#21644d] transition mt-2"
              >
                Create Account
              </button>

            </form>


            <p className="text-center text-sm text-[#718078] mt-7">

              Already have an account?{" "}

              <Link
                to="/"
                className="text-[#39745c] font-semibold hover:underline"
              >
                Login
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Register;