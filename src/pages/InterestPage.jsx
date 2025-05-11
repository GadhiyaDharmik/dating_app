import React, { useState, useEffect, useRef } from "react";
import MainSignUp from "../component/MainSignUp";
import axiosMain from "../http/axiosMain"; // ✅ Ensure this exists
import { Dumbbell, Film, Gamepad2, HeartHandshake } from "lucide-react";
import { useNavigate } from "react-router-dom";

function InterestPage() {
  const formRef = useRef()
  return (
    <MainSignUp
      titleText="Choose your interests to match with someone who shares similar passions"
      text="It will Display on your Profile and you will not able to change it later"
      hasButton={true}
      onButtonClick={() => formRef.current?.requestSubmit()}
    >
      <InterestComponent formRef={formRef} />
    </MainSignUp>
  );
}

const interestGroups = {
  Sports: ["Cricket", "Football", "Swimming"],
  Entertainment: ["Comedy", "Movies", "Music"],
  Wellness: ["Outdoors", "Fitness", "Meditation", "Health", "Weights"],
  Life: ["Weddings", "Dating", "Grownuping", "Relationships", "Weights"],
};

const categoryIcons = {
  Sports: <Gamepad2 size={18} className="text-blue-500 mr-1" />,
  Entertainment: <Film size={18} className="text-pink-500 mr-1" />,
  Wellness: <Dumbbell size={18} className="text-green-500 mr-1" />,
  Life: <HeartHandshake size={18} className="text-purple-500 mr-1" />,
};

const maxSelection = 5;

function InterestComponent({ formRef }) {
  const [selectedCategories, setSelectedCategories] = useState([]); // store category IDs
  const [selectedInterests, setSelectedInterests] = useState([]); // for UI highlight
  const [allInterests, setAllInterests] = useState([]);
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axiosMain
      .get("/interests")
      .then((res) => setAllInterests(res.data))
      .catch((err) => console.error("Failed to fetch interests:", err));
  }, []);

  const toggleInterest = (category) => {
    setFeedback("");

    const interestId = category.id;
    const parent = category.parent;
    const alreadySelected = selectedCategories.includes(interestId);

    if (alreadySelected) {
      setSelectedCategories(selectedCategories.filter((id) => id !== interestId));
    } else {
      if (selectedCategories.length >= maxSelection) {
        setFeedback("You can only select up to 5 interests.");
        return;
      }
      setSelectedCategories([...selectedCategories, interestId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedCategories.length === 0) {
      setFeedback("❌ Please select at least one interest.");
      return;
    }

    try {
      await axiosMain.post(
        "/users/interests",
        { interest_ids: selectedCategories },
        {
          headers: {
            token: localStorage.getItem("authToken"),
          },
        }
      );
      navigate("/profile/photos")
      setFeedback("✅ Interests saved successfully!");
    } catch (err) {
      console.error(err);
      setFeedback("❌ Failed to save interests.");
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5 w-full text-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Tell Your Interest</h2>
      <p className="text-gray-500 text-sm mb-4 font-semibold">Select up to 5 interests</p>

      {/* Loop through parent interests (e.g., Sports, Wellness) */}
      {allInterests.map((interest) => (
        <div key={interest.id}>
          <h3 className="text-gray-700 font-semibold flex items-center gap-2 mb-2">
            {interest.url && (
              <img src={interest.url} alt={interest.e_name} className="w-5 h-5 rounded-full" />
            )}
            {interest.e_name}
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {interest.category.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleInterest({ ...cat, parent: interest })}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2
                ${selectedCategories.includes(cat.id)
                    ? "border-2 border-red-400 bg-gradient-to-r from-[#FF9999] to-[#FF999980] text-white"
                    : "bg-gradient-to-r from-[#FF9999] to-[#FF999980] text-gray-800"
                  }
              `}
              >
                {cat.url && <img src={cat.url} alt={cat.e_name} className="w-4 h-4 rounded-full" />}
                {cat.e_name}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Selected Preview */}
      {/* {selectedCategories.length > 0 && (
        <div className="pt-4 space-y-3">
          <h4 className="text-md font-semibold text-gray-700">Your Selection</h4>
          <div className="space-y-2">
            {Object.entries(
              selectedCategories.reduce((acc, catId) => {
                const parent = allInterests.find((pi) =>
                  pi.category.some((c) => c.id === catId)
                );
                const category = parent?.category.find((c) => c.id === catId);
                if (!parent || !category) return acc;

                if (!acc[parent.e_name]) {
                  acc[parent.e_name] = {
                    icon: categoryIcons[parent.e_name] || null,
                    items: [],
                  };
                }
                acc[parent.e_name].items.push(category.e_name);
                return acc;
              }, {})
            ).map(([parentName, { icon, items }]) => (
              <div
                key={parentName}
                className="bg-white border border-gray-200 shadow-sm rounded-lg px-4 py-3 w-fit"
              >
                <div className="flex items-center gap-2 font-medium text-sm text-gray-800">
                  {icon}
                  {parentName}
                </div>
                <div className="ml-6 text-xs text-gray-600">
                  {items.map((i) => (
                    <div key={i}>• {i}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )} */}

      {/* Feedback & Submit */}
      <div className="pt-2">
        {feedback && (
          <p
            className={`mt-2 text-center text-sm ${feedback.startsWith("✅") ? "text-green-600" : "text-red-600"
              }`}
          >
            {feedback}
          </p>
        )}
      </div>
    </form>
  );
}

export default InterestPage;
