import React, { useState } from "react";
import MainSignUp from "../component/MainSignUp";
import { useNavigate } from "react-router-dom";
import axiosMain from "../http/axiosMain"; // ← your axios instance

function LoginPage() {
  return (
    <MainSignUp
      titleText="Welcome Back!"
      text="Ready to pick up where you left off?"
    >
      <LoginComponent />
    </MainSignUp>
  );
}

function LoginComponent() {
  const navigate = useNavigate();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback("");

    if (!password.trim()) {
      setFeedback("Please enter your password.");
      return;
    }

    const payload = { password };

    if (mobile.trim()) {
      payload.country_code = countryCode
      payload.number = mobile.trim();
    } else if (emailOrUsername.trim()) {
      const value = emailOrUsername.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(value)) {
        payload.email = value;
      } else {
        payload.username = value;
      }
    } else {
      setFeedback("Please enter either mobile number or email/username.");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosMain.post("/login", payload);
      const user = res.data;

      localStorage.setItem("authToken", user.token);
      localStorage.setItem("user_Data", JSON.stringify(user));

      const required = ["dob", "email", "gender", "name", "username"];
      const needsProfile = required.some((field) => !user[field]);

      if (needsProfile) {
        navigate("/profile/data");
      } else {
        navigate("/dashboard/home");
      }
    } catch (err) {
      console.error(err);
      setFeedback(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 rounded-xl">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Login</h2>

      <p className="text-sm text-gray-500 mb-4 text-center">
        You can login using either your mobile number or your email address.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Mobile Number Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            Mobile Number
          </label>
          <div className="flex items-center border border-blue-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-400 overflow-hidden">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="bg-white border-r px-2 py-2 text-sm outline-none text-gray-700"
            >
              <option value="+91">+91</option>
              <option value="+1">+1</option>
              <option value="+44">+44</option>
              <option value="+972">+972</option>
            </select>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter your Mobile Number"
              className="flex-1 px-3 py-2 outline-none text-sm"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-2 text-gray-400 text-sm">Or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Email / Username Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            Email
          </label>
          <input
            type="text"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            placeholder="Enter your email address"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Error Message */}
        {feedback && (
          <p className="text-red-600 text-sm mb-4 text-center">{feedback}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 text-white font-semibold rounded-lg bg-gradient-to-r from-[#00D4FF] to-[#00A3E0] hover:opacity-90 transition ${loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          {loading ? "Logging in…" : "Login"}
        </button>
      </form>

      {/* Footer Links */}
      <div className="text-center text-sm mt-4">
        Don’t have an account?{" "}
        <span
          className="text-[#00A3E0] cursor-pointer"
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </span>
      </div>
      <div
        className="text-[#00A3E0] text-center text-sm cursor-pointer mt-1"
        onClick={() => navigate("/forgot-password")}
      >
        Forgot your password? Reset it here.
      </div>
    </div>
  );
}

export default LoginPage;
