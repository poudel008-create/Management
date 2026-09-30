import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../services/authService";
import { useAuth } from "../context/authContext.jsx";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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

    try {
      const data = await loginUser(formData);
     
      login(data.user, data.token);
      if (data.user.role === "admin") {
        navigate("/admin");
      } else if (data.user.role === "teacher") {
        navigate("/teacher");
      } else {
        navigate("/user");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Invalid email or password"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8f2] flex items-center justify-center px-6 py-10">

      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl overflow-hidden ">

        <div className="p-8 md:p-12 flex items-center">
          <div className="w-full">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#173c31] mt-8 mb-2">
                Welcome Back!
              </h1>
              <p className="text-[#718078]">
                Login to your account to continue.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
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
             
              <div>
                <label className="block text-sm font-medium text-[#40554c] mb-2">
                  Password
                </label>
               <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 rounded-xl bg-[#f7f8f2] border border-[#d8e1da] text-[#173c31] outline-none focus:border-[#39745c] focus:ring-2 focus:ring-[#39745c]/10 transition"
                />
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-[#66776f]">
                  <input
                    type="checkbox"
                    className="accent-[#164b3a]"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  className="text-[#39745c] hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#164b3a] text-white font-semibold hover:bg-[#21644d] transition"
              >
                Login
              </button>

            </form>


            <div className="flex items-center gap-4 my-6">
              <div className="h-px bg-[#dce3dd] flex-1" />
              <span className="text-xs text-[#89968f]">
                OR
              </span>
              <div className="h-px bg-[#dce3dd] flex-1" />
            </div>

            <button
              type="button"
              className="w-full py-3 rounded-xl border border-[#d8e1da] text-[#40554c] hover:bg-[#f4f7f2] transition"
            >
              Continue with Google
            </button>


            <p className="text-center text-sm text-[#718078] mt-7">

              Don't have an account?{" "}

              <Link
                to="/register"
                className="text-[#39745c] font-semibold hover:underline"
              >
                Register
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;