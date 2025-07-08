import React, { useEffect, useRef, useState } from "react";
import MainSignUp from "../component/MainSignUp";
import { useNavigate } from "react-router-dom";
import axiosMain from "../http/axiosMain"; // ← your axios instance

function SignUpForm() {
  const formRef = useRef()
  return (
    <MainSignUp
      titleText="Can You elaborate on your identity?"
      text="It will Display on your Profile and you will not able to change it later"
      hasButton={true}
      onButtonClick={() => formRef.current?.requestSubmit()}

    >
      <SignUpFormComponent formRef={formRef} />
    </MainSignUp>
  );
}

function SignUpFormComponent({ formRef }) {
  const navigate = useNavigate();

  // form state
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback("");

    // simple validation
    if (!name || !username || !email || !dob || !gender) {
      setFeedback("Please fill out all required fields.");
      return;
    }

    const token = localStorage.getItem("authToken"); // or however you stored it

    try {
      setLoading(true);
      await axiosMain.post(
        "/profile",
        { name, username, email, dob, gender },
        { headers: { token } }
      );
      setFeedback("✅ Profile saved!");
      navigate("/profile/general-info");
    } catch (err) {
      console.error(err);
      setFeedback(
        err.response?.data?.message || "❌ Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setEmail(storedEmail);
      setIsDisabled(true);
    }
  }, []);

  const handleChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    localStorage.setItem("userEmail", newEmail);
  };

  return (
    <form
      className="space-y-5 w-full text-sm"
      onSubmit={handleSubmit}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault(); // Prevent default Enter behavior like selecting option from dropdown
          formRef.current?.requestSubmit();
        }
      }}
      ref={formRef}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Fill Your Profile
      </h2>

      {/* Full Name */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-gray-600">
          Full Name<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="As per your ID"
          className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm shadow-sm"
        />
      </div>

      {/* Username */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-gray-600">
          Username<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Create your unique username"
          className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm shadow-sm"
        />
      </div>

      {/* Email */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-gray-600">
          Email<span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={email}
          // onChange={(e) => setEmail(e.target.value)}
          onChange={handleChange}
          placeholder="Enter your email"
          disabled={isDisabled}
          className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm shadow-sm"
        />
      </div>

      {/* Date of Birth */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-gray-600">
          Date of Birth<span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm shadow-sm"
        />
      </div>

      {/* Gender */}
      <div className="flex flex-col">
        <label className="mb-2 font-medium text-gray-600">
          Gender<span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-5">
          {["Female", "Male", "Prefer not to say"].map((label) => (
            <label
              key={label}
              className="flex items-center space-x-2 text-gray-700"
            >
              <input
                type="radio"
                name="gender"
                value={label}
                checked={gender === label}
                onChange={() => setGender(label)}
                className="accent-blue-500"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Save Button */}
      {/* <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 text-white font-semibold rounded-lg bg-gradient-to-r from-[#00D4FF] to-[#00A3E0] hover:opacity-90 transition ${loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
      >
        {loading ? "Saving…" : "Save Profile"}
      </button> */}

      {/* Feedback */}
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

    </form>
  );
}

export default SignUpForm;
