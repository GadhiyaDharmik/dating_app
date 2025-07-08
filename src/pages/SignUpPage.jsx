import React, { useRef, useState } from "react";
import MainSignUp from "../component/MainSignUp";
import axiosMain from "../http/axiosMain";
import { useNavigate } from "react-router-dom";

function SignUp() {
  return (
    <MainSignUp>
      <SignUpComponent />
    </MainSignUp>
  );
}

function SignUpComponent() {
  const navigate = useNavigate();
  const mobileRef = useRef(null);
  const emailRef = useRef(null);
  const [countryCode, setCountryCode] = useState("+91");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const sendOtp = async () => {
    setFeedback("");
    const number = mobileRef.current.value.trim();
    const email = emailRef.current.value.trim();

    if (!number && !email) {
      setFeedback("Please enter a mobile number or an email.");
      return;
    }

    const payload = number
      ? { country_code: countryCode, number }
      : { email };

    try {
      setLoading(true);
      const res = await axiosMain.post("/send-otp", payload);

      if (res.data.errors) {
        setFeedback(res.data.errors?.at(0));
      } else {
        setFeedback("✅ OTP sent! Check your inbox/SMS.");
        localStorage.setItem("userId", res.data);
        navigate("/signup/verify");
      }
    } catch (err) {
      setFeedback(
        err.response?.data?.message || "❌ Something went wrong sending the OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    localStorage.setItem("userEmail", e.target.value);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
      <h6 className="text-sm mb-6 text-gray-800 text-center">
        Enter your mobile number or email to get started.
      </h6>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          sendOtp();
        }}
      >
        <label className="text-sm">Mobile Number</label>
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
            ref={mobileRef}
            placeholder="Enter your mobile number"
            className="flex-1 px-4 py-2 outline-none text-sm"
          />
        </div>

        <div className="flex items-center justify-between my-2">
          <hr className="w-full border-gray-300" />
          <span className="px-2 text-gray-500">or</span>
          <hr className="w-full border-gray-300" />
        </div>

        <label className="text-sm">Email</label>
        <input
          type="text"
          ref={emailRef}
          placeholder="Enter your email address"
          onChange={handleEmailChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex items-center justify-between my-2">
          <hr className="w-full border-gray-300" />
          <span className="px-2 text-gray-500">or</span>
          <hr className="w-full border-gray-300" />
        </div>

        <div className="flex gap-5">
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

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 text-white mb-5 font-semibold rounded-lg bg-gradient-to-r from-[#00D4FF] to-[#00A3E0] ${loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
            } transition`}
        >
          {loading ? "Sending…" : "Sign Up"}
        </button>
      </form>

    <div className="min-h-[20px] mt-4 text-center text-sm transition-all duration-200">
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


      <div className="text-center text-sm">
        Already have an account?{" "}
        <span className="text-[#00A3E0] cursor-pointer" onClick={() => navigate("/login")}>
          Sign In
        </span>
      </div>
      <div className="text-[#00A3E0] text-center text-sm mt-1 cursor-pointer">
        Forgot your password? Reset it here.
      </div>
    </div>
  );
}

export default SignUp;
