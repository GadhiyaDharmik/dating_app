import React, { useState, useEffect, useRef } from "react";
import MainSignUp from "../component/MainSignUp";
import axiosMain from "../http/axiosMain";
import { useNavigate } from "react-router-dom";

function GeneralInfoFormPage() {
  const formRef = useRef();

  return (
    <MainSignUp
      titleText="Can You elaborate on your identity?"
      text="It will Display on your Profile and you will not able to change it later"
      hasButton={true}
      buttonText="NEXT"
      onButtonClick={() => formRef.current?.requestSubmit()}
    >
      <GeneralInfoFormComponent formRef={formRef} />
    </MainSignUp>
  );
}

function GeneralInfoFormComponent({ formRef }) {
  const navigate = useNavigate();

  // 1. Dropdown data & form state
  const [dropdowns, setDropdowns] = useState([]);
  const [locations, setLocations] = useState([])
  const [form, setForm] = useState({
    education_id: "",
    profession_id: "",
    language_id: "",
    status_id: "",
    religion_id: "",
    city_id: "",
    match_intent: "LoveCommitment"
  });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  // 2. Fetch all dropdown options on mount
  useEffect(() => {
    axiosMain
      .get("/dropdowns")
      .then((res) => {
        setDropdowns(res.data)
        localStorage.setItem("dropdowns", JSON.stringify(res.data))
      })
      .catch((err) => console.error("Dropdown fetch error:", err));

    axiosMain
      .get("/locations")
      .then((res) => {
        setLocations(res.data); // 👈 store locations separately
      })
      .catch((err) => console.error("Location fetch error:", err));

  }, []);

  // helper to grab the right sub_categories
  const optionsFor = (keyword) => {
    const cat = dropdowns.find((d) =>
      d.name.toLowerCase().includes(keyword)
    );
    return cat?.sub_categories || [];
  };

  // 3. Wire up your selects
  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  // 4. Submit the six IDs to /personalise
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback("");

    // simple required‐field check
    for (let key of Object.keys(form)) {
      if (!form[key]) {
        setFeedback("Please select every option before continuing.");
        return;
      }
    }

    setLoading(true);
    try {
      // await axiosMain.post(
      //   "/personalise",
      //   { ...form },
      //   { headers: { token: localStorage.getItem("authToken") } }
      // );
      localStorage.setItem("generalInformation", JSON.stringify({ ...form }))
      navigate("/profile/lifestyle");
    } catch (err) {
      console.error(err);
      setFeedback(
        err.response?.data?.message || "❌ Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-5 w-full text-sm" onSubmit={handleSubmit}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault(); // Prevent default Enter behavior like selecting option from dropdown
          formRef.current?.requestSubmit();
        }
      }}
      ref={formRef} >
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        General Information
      </h2>

      {[
        { label: "Education", name: "education_id", key: "education" },
        { label: "Profession", name: "profession_id", key: "profession" },
        { label: "Language", name: "language_id", key: "language" },
        { label: "Status", name: "status_id", key: "status" },
        { label: "Religion", name: "religion_id", key: "religion" },
        { label: "Location", name: "city_id", key: "city" }
      ].map(({ label, name, key }) => (
        <div className="flex flex-col" key={name}>
          <label className="mb-1 font-medium text-gray-600">
            {label}
            <span className="text-red-500">*</span>
          </label>
          <select
            name={name}
            value={form[name]}
            onChange={handleChange}
            className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm shadow-sm"
          >
            <option value="">
              Select Your {label}
            </option>
            {key === "city"
              ? locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.e_name}
                </option>
              ))
              : optionsFor(key).map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.e_name}
                </option>
              ))}

          </select>
        </div>
      ))}

    <div className="min-h-[24px] mt-2 text-center text-sm transition-all duration-200 ease-in-out">
    <p
      className={`transition-opacity duration-200 ${
        feedback
          ? feedback.startsWith("❌")
            ? "text-red-600 opacity-100"
            : "text-green-600 opacity-100"
          : "opacity-0"
      }`}
    >
      {feedback || "‎"}
    </p>
  </div>

      {/* <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 text-white font-semibold rounded-lg bg-gradient-to-r from-[#00D4FF] to-[#00A3E0] hover:opacity-90 transition ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Saving…" : "Save Profile"}
      </button> */}
    </form>
  );
}

export default GeneralInfoFormPage;
