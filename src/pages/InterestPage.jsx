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

const maxSelection = 5;

function InterestComponent({ formRef }) {
  const [selectedCategories, setSelectedCategories] = useState([]); // store category IDs
  const [allInterests, setAllInterests] = useState([
    {
      "id": "0de56c51-1d78-4315-be3a-7a0a44e5b58b",
      "e_name": "Wellness",
      "h_name": null,
      "url": "https://s3.ap-south-1.amazonaws.com/loveai-media/interests/icons/224db579-2d79-49b0-9f0d-8cfcee674eb1.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIARHWSHFT7V65SDPET%2F20250516%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250516T151639Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=310a5b49d475241af19449ab5bb4b928f5115c3a6a464422b4226dec57c7ae42",
      "category": [
        {
          "id": "5431dbd9-fd09-4a94-b04d-fd6a799fef70",
          "e_name": "Weights",
          "h_name": null,
          "url": "https://s3.ap-south-1.amazonaws.com/loveai-media/interests/icons/3cd294bd-cfbc-46b1-8637-beef229c9a54.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIARHWSHFT7V65SDPET%2F20250516%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250516T151639Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=988b2d64dfb5b28cbdaed9cd5e5800e486da5480f266807624384a46896c91ad"
        },
        {
          "id": "87cb5603-2790-4d4c-8559-6aea1d7744b6",
          "e_name": "Outdoors",
          "h_name": null,
          "url": "https://s3.ap-south-1.amazonaws.com/loveai-media/interests/icons/f4fe295d-d655-4244-a410-03a1dfc83ccd.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIARHWSHFT7V65SDPET%2F20250516%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250516T151640Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=6bf55717ee22884c323a4447cc2668ac832286736e6bd0e15d4f30fdbacb2ada"
        },
        {
          "id": "99f453bd-5917-43f2-bfad-8238b317bcba",
          "e_name": "Fitness",
          "h_name": null,
          "url": "https://s3.ap-south-1.amazonaws.com/loveai-media/interests/icons/e10667fe-1479-4902-b78b-1d32ddc2e448.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIARHWSHFT7V65SDPET%2F20250516%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250516T151640Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=61916bceba6f5d48e864cb91fd335e0a22fa967573c840b94845b0808cda0e96"
        },
        {
          "id": "e2abffd6-c94a-4dab-ad61-16182e1e282f",
          "e_name": "Meditation",
          "h_name": null,
          "url": "https://s3.ap-south-1.amazonaws.com/loveai-media/interests/icons/5a5c8001-8bdb-4ce0-877a-26f11488e262.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIARHWSHFT7V65SDPET%2F20250516%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250516T151640Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=5d607f3ec21b71f747a5d0c1149a878a2bf84bcc3e5a586022a81d757bb0b9fa"
        }
      ]
    },
    {
      "id": "16e3a19e-3230-479a-b633-edc5186e5a06",
      "e_name": "Sports",
      "h_name": null,
      "url": "https://s3.ap-south-1.amazonaws.com/loveai-media/interests/icons/941eba31-c849-400a-9ae1-a3e6aea1ac99.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIARHWSHFT7V65SDPET%2F20250516%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250516T151640Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=8a147a68f5f1fd3eb9a15bf4886b5d1509518a6b3c47fc1f970955683296229b",
      "category": [
        {
          "id": "1314bef1-73bd-409c-9cd5-a58ea9a530f4",
          "e_name": "Swimming",
          "h_name": null,
          "url": "https://s3.ap-south-1.amazonaws.com/loveai-media/interests/icons/7107d253-af32-4565-a7d9-7e4e8112d000.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIARHWSHFT7V65SDPET%2F20250516%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250516T151640Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=b5bae29bcd2e9d2753287739ac653389d34c865257d607d6a805d604264185a7"
        },
        {
          "id": "bab34f44-6567-497a-9098-2787107482c4",
          "e_name": "Football",
          "h_name": null,
          "url": "https://s3.ap-south-1.amazonaws.com/loveai-media/interests/icons/ec7636d2-101a-4290-86df-c7370eed4fb0.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIARHWSHFT7V65SDPET%2F20250516%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250516T151640Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=049df37b3b954191da24a2b9617b449801440f6083fc1270f4064eaec29ea7ad"
        },
        {
          "id": "e91ad08f-8c6a-47d7-84d0-d7ee65b4c71a",
          "e_name": "Cricket",
          "h_name": null,
          "url": "https://s3.ap-south-1.amazonaws.com/loveai-media/interests/icons/79f25e6c-d8d6-4641-8ea1-a4bf28427ce9.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIARHWSHFT7V65SDPET%2F20250516%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250516T151640Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=33293f51274f7d49394e8e9f9ba6f1cb63047fb93bff4ced63d8e593e023c501"
        }
      ]
    },
    {
      "id": "599d269b-38c0-41ca-af58-154aa9101c51",
      "e_name": "Entertainment",
      "h_name": null,
      "url": "https://s3.ap-south-1.amazonaws.com/loveai-media/interests/icons/8b107ce7-1f18-47c6-b9bd-bf639b03217f.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIARHWSHFT7V65SDPET%2F20250516%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250516T151640Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=55cf819303d57efacfff803c9d44533d89228114f2112acfc7d0a929fc0139e8",
      "category": [
        {
          "id": "0ff4d1b8-00eb-4013-a9e7-1190ac8a1333",
          "e_name": "Movies",
          "h_name": null,
          "url": "https://s3.ap-south-1.amazonaws.com/loveai-media/interests/icons/920f2337-be53-4492-bbb5-620367667702.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIARHWSHFT7V65SDPET%2F20250516%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250516T151640Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=1165f16125a1359da835aed96665f502d5048ae3ad9c9389aac5ba1f92d8da19"
        },
        {
          "id": "cb93961d-07e8-4844-bd02-82756fcb0ee8",
          "e_name": "Comedy",
          "h_name": null,
          "url": "https://s3.ap-south-1.amazonaws.com/loveai-media/interests/icons/772a509c-840b-404f-af21-3c6c91bfe506.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIARHWSHFT7V65SDPET%2F20250516%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250516T151641Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=30f0b611056ebff51c67e2b23441b7c81d375154be232ec307a4bb6b54c655b5"
        },
        {
          "id": "fdaff24b-ec9a-433a-ab68-6eaf251166cf",
          "e_name": "Music",
          "h_name": null,
          "url": "https://s3.ap-south-1.amazonaws.com/loveai-media/interests/icons/c2958b7c-fae8-41aa-965d-641d315de938.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIARHWSHFT7V65SDPET%2F20250516%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250516T151641Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=1c34addea2b1441094c6d1c9ffd00bcd1095736153eb5352f2018ed52576d014"
        }
      ]
    }
  ]);
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
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault(); // Prevent default Enter behavior like selecting option from dropdown
          formRef.current?.requestSubmit();
        }
      }}
      className="space-y-5 w-full text-sm h-full">
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
                    ? "bg-gradient-to-r from-[#00D4FF] to-[#00A3E0] text-white"
                    : "bg-gradient-to-r from-[#FF9999] to-[#FF999980] text-white"}
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
   <div className="min-h-[24px] pt-2 transition-all duration-200 ease-in-out">
  <p
    className={`text-center text-sm transition-opacity duration-200 ${
      feedback
        ? feedback.startsWith("✅")
          ? "text-green-600 opacity-100"
          : "text-red-600 opacity-100"
        : "opacity-0"
    }`}
  >
    {feedback || "‎"} {/* Invisible character to preserve height */}
  </p>
</div>

    </form>
  );
}

export default InterestPage;
