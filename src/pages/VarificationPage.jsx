import React, { useState, useEffect } from "react";
import MainSignUp from "../component/MainSignUp";
import axiosMain from "../http/axiosMain";  // ← your axios instance
import { useNavigate } from "react-router-dom";

function VarificationPage() {
  return (
    <MainSignUp>
      <VarificationComponent />
    </MainSignUp>
  );
}

function VarificationComponent() {
  const [otp, setOtp] = useState(["", "", "", "","", ""]);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate()

  // Countdown timer logic
  useEffect(() => {
    if (timer === 0) return;
    const countdown = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(countdown);
  }, [timer]);

  // Handle OTP input
  const handleChange = (e, index) => {
    const value = e.target.value.slice(0, 1);
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    // Move focus forward
    if (value && index < 6) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  // Handle backspace: clear this box and move focus back
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const updatedOtp = [...otp];
      updatedOtp[index] = "";
      setOtp(updatedOtp);
      if (index > 0) {
        document.getElementById(`otp-${index - 1}`)?.focus();
      }
    }
  };

  // Verify OTP
  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 4) {
      setFeedback("Please enter all 4 digits.");
      return;
    }

    // replace with your actual user_id source
    const userId = localStorage.getItem("userId") || "<USER_ID>";

    setLoading(true);
    setFeedback("");
    try {
      await axiosMain.post("/verify-otp", {
        user_id: userId,
        otp: code,
      });
      navigate("/signup/confirm-password")
      setFeedback("✅ Verification successful!");
      // TODO: navigate on success
    } catch (err) {
      setFeedback(
        err.response?.data?.message || "❌ OTP verification failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-16 bg-gray-50">
      <div className="max-w-md w-full p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">
          Verification Code
        </h2>
        <h6 className="text-sm mb-6 text-gray-600 text-center">
          Enter the code sent to your mobile number.
        </h6>

        {/* OTP Input */}
        <div className="flex justify-center gap-4 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center border rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={1}
            />
          ))}
        </div>

        {/* Resend timer */}
        <div className="text-center text-sm text-gray-500 mb-4">
          {timer > 0 ? (
            <>
              Resend code in <span className="font-semibold">{timer}s</span>
            </>
          ) : (
            <button
              onClick={() => {
                setTimer(30);
                setFeedback("");
                // optionally re-trigger send-otp here
              }}
              className="text-blue-600 hover:underline font-medium"
            >
              Resend Code
            </button>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleVerify}
          disabled={loading}
          className={`w-full py-2 text-white font-semibold rounded-lg bg-gradient-to-r from-[#00D4FF] to-[#00A3E0] ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
          } transition`}
        >
          {loading ? "Verifying…" : "Submit"}
        </button>

        {/* Feedback */}
        {feedback && (
          <p
            className={`mt-4 text-center text-sm ${
              feedback.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {feedback}
          </p>
        )}
      </div>
    </div>
  );
}

export default VarificationPage;
