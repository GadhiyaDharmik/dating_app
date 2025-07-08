import React, { useState } from "react";
import MainSignUp from "../component/MainSignUp";
import axiosMain from "../http/axiosMain";
import { useNavigate } from "react-router-dom";

function ConfirmPasswordPage() {
  return (
    <MainSignUp>
      <PasswordComponent />
    </MainSignUp>
  );
}

function PasswordComponent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validatePassword = (pwd) => {
    const errors = {};
    if (!pwd.match(/[A-Z]/)) {
      errors.uppercase = "At least one uppercase letter required";
    }
    if (pwd.length < 8) {
      errors.length = "Minimum 8 characters required";
    }
    return errors;
  };

  const getPasswordStrength = (password) => {
    if (password.length === 0) return "";
    const valid = validatePassword(password);
    if (Object.keys(valid).length === 0) return "Strong";
    if (password.length >= 6) return "Moderate";
    return "Weak";
  };

  const strength = getPasswordStrength(password);
  const strengthColor =
    strength === "Strong"
      ? "bg-green-500"
      : strength === "Moderate"
      ? "bg-yellow-400"
      : strength === "Weak"
      ? "bg-red-500"
      : "bg-gray-300";

  const handleSubmit = async () => {
    setFeedback("");
    const passwordErrors = validatePassword(password);

    if (Object.keys(passwordErrors).length > 0) {
      setErrors(passwordErrors);
      return;
    }

    if (password !== confirmPassword) {
      setFeedback("❌ Passwords do not match.");
      return;
    }

    const userId = localStorage.getItem("userId") || "<USER_ID>";
    setLoading(true);

    try {
      await axiosMain.post("/profile-activate", {
        user_id: userId,
        password,
      });
      setFeedback("✅ Password set! Your profile is now active.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setFeedback(err.response?.data?.message || "❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="max-w-md w-full p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Create Password
        </h2>

        {/* Password Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors(validatePassword(e.target.value));
              setFeedback("");
            }}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Password Validation (No layout shift) */}
          <div className="min-h-[42px] mt-1 text-sm text-red-500 transition-all duration-200 space-y-1">
            <p
              className={`transition-opacity duration-200 ${
                errors.length ? "opacity-100" : "opacity-0"
              }`}
            >
              {errors.length || "‎"}
            </p>
            <p
              className={`transition-opacity duration-200 ${
                errors.uppercase ? "opacity-100" : "opacity-0"
              }`}
            >
              {errors.uppercase || "‎"}
            </p>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="mt-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setFeedback("");
            }}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password Strength Indicator */}
        <div className="flex items-center gap-3 my-2">
          <div className={`h-1 rounded ${strengthColor} w-[50%]`} />
          <span
            className={`text-sm font-medium ${
              strength === "Strong"
                ? "text-green-600"
                : strength === "Moderate"
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {strength}
          </span>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-2 text-white font-semibold rounded-lg bg-gradient-to-r from-[#00D4FF] to-[#00A3E0] hover:opacity-90 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Setting…" : "Submit"}
        </button>

        {/* Feedback Message (No layout shift) */}
        <div className="min-h-[24px] mt-4 text-center text-sm transition-all duration-200 ease-in-out">
          <p
            className={`transition-opacity duration-200 ${
              feedback
                ? feedback.startsWith("✅")
                  ? "text-green-600 opacity-100"
                  : "text-red-600 opacity-100"
                : "opacity-0"
            }`}
          >
            {feedback || "‎"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ConfirmPasswordPage;
