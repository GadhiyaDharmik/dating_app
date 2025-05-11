import { useState, useRef } from "react";
import { PlusCircle } from "lucide-react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

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
  const fileInputRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(null);

  const handleAddPhoto = (event) => {
    const files = event.target.files;
    if (files && files[0] && currentIndex !== null) {
      const newImageUrl = URL.createObjectURL(files[0]);
      const updatedImages = [...images];
      updatedImages[currentIndex] = newImageUrl;
      setImages(updatedImages);
    }
  };

  const handleClickAdd = (index) => {
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
            className="min-w-[10rem] h-40 bg-gray-100 rounded-md overflow-hidden border-2 border-dashed border-gray-300 flex-shrink-0 cursor-pointer relative flex items-center justify-center"
          >
            {src ? (
              <img
                src={src}
                alt={`Uploaded ${index + 1}`}
                className="w-full h-full object-cover"
              />
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
    </div>
  );
}

function PersonalInfoFormData() {
  const [selectedInterests, setSelectedInterests] = useState([]); // State to manage selected interests

  const interests = {
    Sports: ["Cricket", "Football", "Swimming"],
    Entertainment: ["Comedy", "Movies", "Music"],
    Wellness: ["Outdoors", "Fitness", "Meditation", "Weights"],
    Health: [
      "Health",
      "Life",
      "Weddings",
      "Dating",
      "Grownuping",
      "Relationships",
    ],
  };

  const handleInterestClick = (category, interest) => {
    // Handle selecting/deselecting interests
    const interestString = `${category}-${interest}`;
    if (selectedInterests.includes(interestString)) {
      setSelectedInterests(
        selectedInterests.filter((item) => item !== interestString)
      );
    } else if (selectedInterests.length < 5) {
      setSelectedInterests([...selectedInterests, interestString]);
    }
  };

  const [distanceRange, setDistanceRange] = useState([18, 25]);
  const [gender, setGender] = useState(""); // State to manage selected gender

  return (
    <form className="bg-white p-6 rounded-xl shadow-md space-y-6">
      {/* Section 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm mb-1">Full Name*</label>
          <input className="input" placeholder="Enter your full name" />
        </div>
        <div>
          <label className="block text-sm mb-1">User Name*</label>
          <input className="input" placeholder="Enter your username" />
        </div>
        <div>
          <label className="block text-sm mb-1">Mobile Number*</label>
          <input className="input" placeholder="Enter your mobile number" />
        </div>
        <div>
          <label className="block text-sm mb-1">Date of Birth*</label>
          <input className="input" type="date" />
        </div>
        <div>
          <label className="block text-sm mb-1">Email*</label>
          <input className="input" placeholder="Enter your email" />
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
          <input className="input" placeholder="Enter your Location" />
        </div>
      </div>

      <span>Genral Information</span>

      {/* Section 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          "Education",
          "Profession",
          "Language",
          "Status",
          "Religion",
          "Location",
        ].map((label, i) => (
          <div key={i}>
            <label className="block text-sm   mb-1">Select Your {label}</label>
            <select className="input">
              <option>{`Select Your ${label}`}</option>
            </select>
          </div>
        ))}
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
                      className={`px-4 py-2 rounded-full text-sm transition-colors ${
                        isSelected
                          ? "bg-[#00D4FF] text-white"
                          : "bg-[#FF9999] text-white"
                      } ${
                        selectedInterests.length >= 5 && !isSelected
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

      {/* Description */}
      <div>
        <label className="block text-sm   mb-1">About Yourself</label>
        <textarea
          className="input"
          placeholder="Write a brief description (300 characters)"
          rows="3"
        />
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
