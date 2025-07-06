import { useState, useRef, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import axiosMain from "../http/axiosMain";

function PersonalInfoForm() {
  return (
    <div>
      Update your personal photos here
      <ImagesComponent />
      <PersonalInfoFormData />
    </div>
  );
}

function ImagesComponent() {
  const maxPhotos = 10;
  const [images, setImages] = useState(Array(maxPhotos).fill(null));
  const [imageFiles, setImageFiles] = useState(Array(maxPhotos).fill(null)); // Store actual files
  const [uploadedImages, setUploadedImages] = useState(Array(maxPhotos).fill(null)); // Track uploaded images
  const fileInputRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Get user data and token
  const getUserData = () => {
    const storedUserData = JSON.parse(localStorage.getItem("user_Data"));
    return storedUserData;
  };

  const handleAddPhoto = async (event) => {
    const files = event.target.files;
    if (files && files[0] && currentIndex !== null) {
      const file = files[0];
      const newImageUrl = URL.createObjectURL(file);

      // Update UI immediately
      const updatedImages = [...images];
      const updatedFiles = [...imageFiles];
      updatedImages[currentIndex] = newImageUrl;
      updatedFiles[currentIndex] = file;
      setImages(updatedImages);
      setImageFiles(updatedFiles);

      // Upload to server
      await uploadPhoto(file, currentIndex);
    }
  };

  const uploadPhoto = async (file, index) => {
    setIsUploading(true);
    try {
      const userData = getUserData();
      const userId = userData?.id;
      const token = userData?.token;

      if (!userId || !token) {
        alert("User not authenticated");
        return;
      }

      const formData = new FormData();
      formData.append('files', file);

      const response = await axiosMain.post(
        `/users/${userId}/gallary`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token,
          },
        }
      );

      // Mark as uploaded
      const updatedUploaded = [...uploadedImages];
      updatedUploaded[index] = true;
      setUploadedImages(updatedUploaded);

      console.log("Photo uploaded successfully:", response.data);
    } catch (error) {
      console.error("Photo upload failed:", error);
      alert("Failed to upload photo. Please try again.");

      // Remove from UI if upload failed
      const updatedImages = [...images];
      const updatedFiles = [...imageFiles];
      updatedImages[index] = null;
      updatedFiles[index] = null;
      setImages(updatedImages);
      setImageFiles(updatedFiles);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClickAdd = (index) => {
    if (isUploading) return; // Prevent clicking during upload
    setCurrentIndex(index);
    fileInputRef.current.click();
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-4 px-2 py-3 w-[1200px]">
        {images.map((src, index) => (
          <div
            key={index}
            onClick={() => handleClickAdd(index)}
            className={`min-w-[10rem] h-40 bg-gray-100 rounded-md overflow-hidden border-2 border-dashed border-gray-300 flex-shrink-0 cursor-pointer relative flex items-center justify-center ${isUploading && currentIndex === index ? 'opacity-50' : ''
              }`}
          >
            {src ? (
              <>
                <img
                  src={src}
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {uploadedImages[index] && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                    ✓
                  </div>
                )}
                {isUploading && currentIndex === index && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-white text-sm">Uploading...</div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center text-gray-500">
                <PlusCircle size={28} className="mb-1 text-blue-500" />
                <p className="text-sm">Add Photo</p>
              </div>
            )}
          </div>
        ))}

        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAddPhoto}
        />
      </div>
      {isUploading && (
        <div className="text-center text-sm text-blue-600 mt-2">
          Uploading photo...
        </div>
      )}
    </div>
  );
}

function PersonalInfoFormData() {
  const [userData, setUserData] = useState({});
  const [initialForm, setInitialForm] = useState(null);
  const [initialAbout, setInitialAbout] = useState("");
  const [initialDistanceRange, setInitialDistanceRange] = useState([18, 25]);
  const [initialInterests, setInitialInterests] = useState([]);

  const [form, setForm] = useState({
    education_id: "",
    profession_id: "",
    language_id: "",
    status_id: "",
    religion_id: "",
    city_id: "",
    drinking_id: "",
    smoking_id: "",
    eating_id: "",
    match_intent: "LoveCommitment"
  });

  const [about, setAbout] = useState("");
  const [distanceRange, setDistanceRange] = useState([18, 25]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [dropdowns, setDropdowns] = useState([]);
  const [locations, setLocations] = useState([]);

  const interests = {
    Sports: ["Cricket", "Football", "Swimming"],
    Entertainment: ["Comedy", "Movies", "Music"],
    Wellness: ["Outdoors", "Fitness", "Meditation", "Weights"],
    Health: ["Health", "Life", "Weddings", "Dating", "Grownuping", "Relationships"]
  };

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("user_Data"));
    const userId = storedUserData?.id;

    if (userId) {
      // Fetch user info
      axiosMain.get(`/users/${userId}/info`)
        .then((res) => {
          const user = res.data;

          const transformedUserData = {
            id: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
            gender: user.gender,
            dob: user.dob,
            url: user.url,
            education_id: user.educations?.id || "",
            profession_id: user.professions?.id || "",
            language_id: user.languages?.id || "",
            status_id: user.statuses?.id || "",
            religion_id: user.religions?.id || "",
            drinking_id: user.drinking?.id || "",
            smoking_id: user.smoking?.id || "",
            eating_id: user.eating?.id || "",
            city_id: user.city?.id || "",
            about: user.about || "",
            cityAndCountryName: user.city,
            country_code: user.country_code,
            number: user.number,
            token: storedUserData?.token
          };

          const formInitial = {
            education_id: transformedUserData.education_id,
            profession_id: transformedUserData.profession_id,
            language_id: transformedUserData.language_id,
            status_id: transformedUserData.status_id,
            religion_id: transformedUserData.religion_id,
            city_id: transformedUserData.city_id,
            drinking_id: transformedUserData.drinking_id,
            smoking_id: transformedUserData.smoking_id,
            eating_id: transformedUserData.eating_id,
            match_intent: "LoveCommitment"
          };

          setUserData(transformedUserData);
          setForm(formInitial);
          setInitialForm(formInitial);
          setAbout(transformedUserData.about || "");
          setInitialAbout(transformedUserData.about || "");
          setFullName(transformedUserData.name || "");
          setUserName(transformedUserData.username || "");
          setDob(transformedUserData.dob || "");
          setGender(transformedUserData.gender || "");
          setEmail(transformedUserData.email || "");
          setMobile(`+${transformedUserData.country_code} ${transformedUserData.number}` || "");
          setInitialDistanceRange([18, 25]);
        });

      // Fetch and format selected interests
      axiosMain.get(`/users/${userId}/interests`, {
        headers: { token: storedUserData?.token }
      })
        .then((res) => {
          const apiInterests = res.data?.interests || [];
          const formattedInterests = apiInterests.map((item) => {
            const category = item.interest?.category?.e_name;
            const interest = item.interest?.e_name;
            return `${category}-${interest}`;
          });
          setSelectedInterests(formattedInterests);
          setInitialInterests(formattedInterests);
        })
        .catch((err) => {
          console.error("Failed to fetch interests:", err);
          setSelectedInterests([]);
          setInitialInterests([]);
        });
    }
  }, []);

  useEffect(() => {
    axiosMain.get("/dropdowns").then((res) => {
      setDropdowns(res.data);
    });

    axiosMain.get("/locations").then((res) => {
      setLocations(res.data);
    });
  }, []);

  const token = userData?.token;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Function to update interests API
  const updateInterests = async (interestIds) => {
    try {
      await axiosMain.post(
        "/users/interests",
        { interest_ids: interestIds },
        {
          headers: {
            token: localStorage.getItem("authToken") || token,
          },
        }
      );
    } catch (error) {
      console.error("Failed to update interests:", error);
      throw error;
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const profileData = {
      name: fullName,
      username: userName,
      dob,
      gender
    };

    const formChanged = JSON.stringify(form) !== JSON.stringify(initialForm);
    const profileChanged = (
      profileData.name !== userData.name ||
      profileData.username !== userData.username ||
      profileData.dob !== userData.dob ||
      profileData.gender !== userData.gender
    );
    const aboutChanged = about !== initialAbout;
    const interestsChanged = JSON.stringify(selectedInterests) !== JSON.stringify(initialInterests);
    const rangeChanged = JSON.stringify(distanceRange) !== JSON.stringify(initialDistanceRange);

    try {
      if (profileChanged) {
        await axiosMain.put(`/profile`, profileData, {
          headers: {
            token,
            "Content-Type": "application/json"
          }
        });

        const updatedUserData = { ...userData, ...profileData };
        localStorage.setItem("user_Data", JSON.stringify(updatedUserData));
        setUserData(updatedUserData);
      }

      if (formChanged || aboutChanged) {
        await axiosMain.put("/personalise", {
          ...form,
          about,
          distance_range: distanceRange,
          match_intent: "LoveCommitment"
        }, {
          headers: {
            token,
            "Content-Type": "application/json"
          }
        });
      }

      // Update interests separately if changed
      if (interestsChanged) {
        // Convert selected interests to IDs (you may need to modify this based on your data structure)
        const interestIds = selectedInterests.map(interest => {
          // Extract the interest name from "category-interest" format
          const interestName = interest.split('-')[1];
          // You might need to find the actual ID from your interests data
          // This is a placeholder - adjust based on your actual data structure
          return interestName;
        });

        await updateInterests(interestIds);
      }

      // Update initial states
      setInitialForm(form);
      setInitialAbout(about);
      setInitialDistanceRange(distanceRange);
      setInitialInterests(selectedInterests);

      alert("Profile updated successfully!");

    } catch (error) {
      console.error("Update failed:", error);
      alert("Something went wrong during update.");
    }
  };

  const optionsFor = (keyword) => {
    const cat = dropdowns.find((d) => d.name.toLowerCase().includes(keyword));
    return cat?.sub_categories || [];
  };

  const handleInterestClick = (category, interest) => {
    const interestString = `${category}-${interest}`;
    if (selectedInterests.includes(interestString)) {
      setSelectedInterests(selectedInterests.filter((item) => item !== interestString));
    } else if (selectedInterests.length < 5) {
      setSelectedInterests([...selectedInterests, interestString]);
    }
  };

  return (
    <form
      className="bg-white p-6 rounded-xl shadow-md space-y-6"
      onSubmit={handleUpdateProfile}
    >
      {/* Section 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm mb-1">Full Name*</label>
          <input
            className="input"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">User Name*</label>
          <input
            className="input"
            placeholder="Enter your username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Mobile Number*</label>
          <input className="input" placeholder="Enter your mobile number" value={mobile} readOnly />
        </div>
        <div>
          <label className="block text-sm mb-1">Date of Birth*</label>
          <input
            className="input"
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Email*</label>
          <input className="input" placeholder="Enter your email" value={email} readOnly />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Distance Preference (km)
          </label>
          <div className="flex justify-between text-sm text-gray-700 font-semibold mb-1 px-1">
            <span>{distanceRange[0]} km</span>
            <span>{distanceRange[1]} km</span>
          </div>
          <RangeSlider
            min={1}
            max={100}
            step={1}
            value={distanceRange}
            onInput={setDistanceRange}
            className="!h-3"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Gender</label>
          <div className="flex gap-4">
            {["Male", "Female", "Prefer not to say"].map((option) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value={option}
                  checked={gender === option}
                  onChange={() => setGender(option)}
                  className="accent-blue-500"
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Location*</label>
          <input
            className="input"
            placeholder="Enter your Location"
            value={
              userData.cityAndCountryName && userData.cityAndCountryName.country
                ? `${userData.cityAndCountryName.e_name}, ${userData.cityAndCountryName.country.e_name}`
                : ""
            }
            readOnly
          />
        </div>
      </div>

      <span>General Information</span>

      {/* Section 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          { label: "Education", name: "education_id", key: "education" },
          { label: "Profession", name: "profession_id", key: "profession" },
          { label: "Language", name: "language_id", key: "language" },
          { label: "Status", name: "status_id", key: "status" },
          { label: "Religion", name: "religion_id", key: "religion" },
          { label: "Location", name: "city_id", key: "city" },
        ].map(({ label, name, key }) => (
          <div key={name}>
            <label className="block text-sm mb-1">
              Select Your {label}
              <span className="text-red-500">*</span>
            </label>
            <select
              name={name}
              value={form[name]}
              onChange={handleChange}
              className="input"
            >
              <option value="">{`Select Your ${label}`}</option>
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
      </div>

      {/* Section 3 */}
      <span>Life Style</span>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          { label: "Drinking", name: "drinking_id", key: "drinking" },
          { label: "Smoking", name: "smoking_id", key: "smoking" },
          { label: "Eating", name: "eating_id", key: "eating" },
        ].map(({ label, name, key }) => (
          <div key={name}>
            <label className="block text-sm mb-1">
              {label}
              <span className="text-red-500">*</span>
            </label>
            <select
              name={name}
              value={form[name]}
              onChange={handleChange}
              className="input"
            >
              <option value="">{`Select Your ${label}`}</option>
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
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm mb-1">About Yourself</label>
        <textarea
          className="input"
          placeholder="Write a brief description (300 characters)"
          rows="3"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        />
      </div>

      {/* Your Interest Section */}
      <div>
        <label className="block text-sm font-medium mb-1">Your Interest</label>
        <p className="text-sm mb-2">Select up to 5 interests</p>

        <div className="space-y-4">
          {Object.keys(interests).map((category) => (
            <div key={category}>
              <p className="text-sm font-semibold">{category}</p>
              <div className="flex gap-4 flex-wrap">
                {interests[category].map((interest) => {
                  const isSelected = selectedInterests.includes(
                    `${category}-${interest}`
                  );
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleInterestClick(category, interest)}
                      className={`px-4 py-2 rounded-full text-sm transition-colors ${isSelected
                        ? "bg-[#00D4FF] text-white"
                        : "bg-[#FF9999] text-white"
                        } ${selectedInterests.length >= 5 && !isSelected
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer"
                        }`}
                      disabled={selectedInterests.length >= 5 && !isSelected}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 rounded-xl font-semibold hover:opacity-90"
      >
        UPDATE
      </button>
    </form>
  );
}

export default PersonalInfoForm;