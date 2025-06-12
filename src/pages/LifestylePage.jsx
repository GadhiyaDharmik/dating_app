import React, { useEffect, useRef, useState } from "react";
import MainSignUp from "../component/MainSignUp";
import axiosMain from "../http/axiosMain"; // 👈 required for API call
import { useNavigate } from "react-router-dom";

function LifestyleFormPage() {
  const formRef = useRef()
  return (
    <MainSignUp
      titleText="Can You elaborate on your identity?"
      text="It will Display on your Profile and you will not able to change it later"
      hasButton={true}
      buttonText="NEXT"
      onButtonClick={() => formRef.current?.requestSubmit()}
    >
      <LifestyleFormComponent formRef={formRef} />
    </MainSignUp>
  );
}

function LifestyleFormComponent({ formRef }) {
  const [dropdowns, setDropdowns] = useState([]);
  const [formData, setFormData] = useState({
    drinking_id: "",
    smoking_id: "",
    eating_id: "",
    about: "",
  });
  const navigate = useNavigate()

  useEffect(() => {
    const localData = localStorage.getItem("dropdowns");
    if (localData) {
      setDropdowns(JSON.parse(localData)); // ✅ Fix: Parse it first

    } else {
      axiosMain
        .get("/dropdowns")
        .then((res) => {
          setDropdowns(res.data);
          localStorage.setItem("dropdowns", JSON.stringify(res.data));
        })
        .catch((err) => console.error("Dropdown fetch error:", err));
    }
  }, []);

  const getOptions = (key) => {
    return (
      dropdowns.find((d) => d.name?.toLowerCase() === key.toLowerCase())
        ?.sub_categories || []
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 4. Submit the six IDs to /personalise
  const handleSubmit = async (e) => {
    e.preventDefault();
    // setFeedback("");

    // // simple required‐field check
    // for (let key of Object.keys(form)) {
    //   if (!form[key]) {
    //     setFeedback("Please select every option before continuing.");
    //     return;
    //   }  
    // }


    // setLoading(true);
    try {
      await axiosMain.post(
        "/personalise",
        { ...JSON.parse(localStorage.getItem("generalInformation")), ...formData },
        { headers: { token: localStorage.getItem("authToken") } }
      );
      // localStorage.setItem("generalInformation", JSON.stringify({ ...form }))
      navigate("/profile/interests");
    } catch (err) {
      console.error(err);
      // setFeedback(
      //   err.response?.data?.message || "❌ Something went wrong."
      // );
    } finally {
      // setLoading(false);
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
      ref={formRef}>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Lifestyle Information
      </h2>

      {/* Drinking */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-gray-600">
          Drinking<span className="text-red-500">*</span>
        </label>
        <select
          name="drinking_id"
          value={formData.drinking_id}
          onChange={handleChange}
          className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm shadow-sm"
        >
          <option value="">Select an option</option>
          {getOptions("drinking").map((item) => (
            <option key={item.id} value={item.id}>
              {item.e_name}
            </option>
          ))}
        </select>
      </div>

      {/* Smoking */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-gray-600">
          Smoking<span className="text-red-500">*</span>
        </label>
        <select
          name="smoking_id"
          value={formData.smoking_id}
          onChange={handleChange}
          className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm shadow-sm"
        >
          <option value="">Select an option</option>
          {getOptions("smoking").map((item) => (
            <option key={item.id} value={item.id}>
              {item.e_name}
            </option>
          ))}
        </select>
      </div>

      {/* Eating */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-gray-600">
          Eating<span className="text-red-500">*</span>
        </label>
        <select
          name="eating_id"
          value={formData.eating_id}
          onChange={handleChange}
          className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm shadow-sm"
        >
          <option value="">Select an option</option>
          {getOptions("eating").map((item) => (
            <option key={item.id} value={item.id}>
              {item.e_name}
            </option>
          ))}
        </select>
      </div>

      {/* About */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-gray-600">
          About<span className="text-red-500">*</span>
        </label>
        <textarea
          name="about"
          value={formData.about}
          onChange={handleChange}
          maxLength={300}
          placeholder="Write a brief description about yourself (max 300 characters)"
          className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm shadow-sm resize-none h-28"
        />
      </div>
    </form>
  );
}

export default LifestyleFormPage;
