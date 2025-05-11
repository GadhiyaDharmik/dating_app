import React, { useState } from "react";
import MainSignUp from "../component/MainSignUp";
import { useNavigate } from "react-router-dom";
import axiosMain from "../http/axiosMain";  // ← your axios instance

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
  const naviagate = useNavigate();
  const [identifier, setIdentifier] = useState(""); // email / phone / username
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback("");

    if (!identifier.trim() || !password) {
      setFeedback("Please enter both your email/phone and password.");
      return;
    }

    // build payload...
    const payload = { password };
    if (identifier.includes("@")) payload.email = identifier.trim();
    else if (/^\d+$/.test(identifier.trim())) {
      payload.country_code = "91";
      payload.number = identifier.trim();
    } else {
      payload.username = identifier.trim();
    }

    try {
      setLoading(true);
      const res = await axiosMain.post("/login", payload);
      const user = res.data;

      // store token
      localStorage.setItem("authToken", user.token);

      // check for any missing profile fields
      const required = ["dob", "email", "gender", "name", "username"];
      const needsProfile = required.some((field) => {
        const val = user[field];
        return val === null || val === undefined || val === "";
      });

      // route accordingly
      if (needsProfile) {
        naviagate("/profile/data");
      } else {
        naviagate("/dashboard/home");
        localStorage.setItem("user_Data", JSON.stringify(user));

      }
    } catch (err) {
      console.error(err);
      setFeedback(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 rounded-xl">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Login
      </h2>
      <div className="text-center mb-5">Email or Phone Number</div>

      <form onSubmit={handleSubmit}>
        {/* Email or Phone */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone or Email
          </label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Enter your phone or email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* error message */}
        {feedback && (
          <p className="text-red-600 text-sm mb-4 text-center">{feedback}</p>
        )}

        {/* OR Divider */}
        <div className="flex items-center justify-between my-4">
          <hr className="w-full border-gray-300" />
          <span className="px-2 text-gray-500 text-sm">or</span>
          <hr className="w-full border-gray-300" />
        </div>

        {/* Social Buttons */}
        <div className="flex gap-4 mb-4">
          <button
            type="button"
            className="w-1/2 flex items-center justify-center bg-white border border-gray-300 p-2 rounded-lg hover:bg-gray-100"
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Google
          </button>
          <button
            type="button"
            className="w-1/2 flex items-center justify-center bg-white border border-gray-300 p-2 rounded-lg hover:bg-gray-100"
          >
            <img
              src="https://www.svgrepo.com/show/475647/facebook-color.svg"
              alt="Facebook"
              className="w-5 h-5 mr-2"
            />
            Facebook
          </button>
        </div>

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
          onClick={() => naviagate("/signup")}
        >
          Sign Up
        </span>
      </div>
      <div
        className="text-[#00A3E0] text-center text-sm cursor-pointer mt-1"
        onClick={() => naviagate("/forgot-password")}
      >
        Forgot your password? Reset it here.
      </div>
    </div>
  );
}

export default LoginPage;
