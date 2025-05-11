// SearchFilterBar.jsx

import React, { useState } from "react";
import { Search, Users, User, Filter, X } from "lucide-react";

const FilterSection = ({ label, options, selected }) => {
  return (
    <div className="mb-6">
      <p className="text-sm text-pink-500 font-medium mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((item) => {
          const isActive = selected.includes(item);
          return (
            <button
              key={item}
              className={`px-4 py-1 text-sm rounded-full border ${
                isActive
                  ? "bg-cyan-400 text-white border-cyan-400"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const FilterModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-transperant bg-opacity-40 flex justify-end">
      <div className="bg-white w-full sm:w-[420px] h-full shadow-lg px-6 py-4 overflow-y-auto rounded-l-xl scrollbar-hide">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-gray-800">Filter & Show</h2>
          <X className="w-5 h-5 text-gray-600 cursor-pointer hover:text-red-500" onClick={onClose} />
        </div>
        <button className="text-sm text-red-500 underline mb-4">Reset all</button>

        {/* Distance range */}
        <div className="mb-6">
          <p className="text-sm text-pink-500 font-medium mb-1">Distance range</p>
          <input type="range" min="0" max="500" className="w-full accent-cyan-400" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0.00 km</span>
            <span>500.00 km</span>
          </div>
        </div>

        {/* Age range */}
        <div className="mb-6">
          <p className="text-sm text-pink-500 font-medium mb-1">Age</p>
          <input type="range" min="21" max="70" className="w-full accent-cyan-400" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>21</span>
            <span>70</span>
          </div>
        </div>

        <FilterSection label="Search Preferences" options={["Male", "Female", "Random"]} selected={["Female"]} />
        <FilterSection
          label="Interests"
          options={["Travel", "Cooking", "Hiking", "Yoga", "Gaming", "Movies", "Books", "Animals", "Wine", "Comedy", "Football", "Meditation", "Pet allowed"]}
          selected={["Cooking", "Animals"]}
        />
        <FilterSection
          label="Languages I Know"
          options={["English", "Gujarati", "Hindi", "Bengali", "Portuguese", "Russian", "Japanese", "Turkish", "French", "Korean", "German", "Vietnamese"]}
          selected={["Gujarati", "Turkish"]}
        />
        <FilterSection
          label="Religion"
          options={["Casual", "Friendship", "Dating", "Buddhism", "Judaism", "Sikhism", "Taoism", "Jainism", "Shintoism", "Bahá'í Faith", "Zoroastrianism"]}
          selected={["Friendship"]}
        />
        <FilterSection
          label="Relationship Goals"
          options={["Casual", "Friendship", "Serious Relationship", "Open to Options", "Networking", "Exploration"]}
          selected={["Friendship"]}
        />
        <FilterSection label="Verify Profile" options={["Unverify", "Verify"]} selected={["Verify"]} />

        {/* Buttons */}
        <div className="flex justify-between mt-8">
          <button className="w-1/2 mr-2 px-4 py-2 bg-cyan-400 text-white rounded-full hover:bg-cyan-500">
            Reset
          </button>
          <button className="w-1/2 ml-2 px-4 py-2 bg-pink-400 text-white rounded-full hover:bg-pink-500">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

const SearchFilterBar = () => {
  const [showFilterModal, setShowFilterModal] = useState(false);

  return (
    <>
      <div className="w-full flex items-center justify-between px-8 py-4 bg-white shadow">
        {/* Search Input */}
        <div className="flex items-center w-1/2 bg-white border border-gray-200 rounded-full px-4 py-2">
          <input
            type="text"
            placeholder="Search by name..."
            className="flex-grow outline-none text-sm text-gray-700 placeholder-gray-400"
          />
          <Search className="w-4 h-4 text-gray-400" />
        </div>

        {/* Filter Options */}
        <div className="flex items-center gap-6 ml-4 text-sm font-medium text-gray-700">
          <div className="flex items-center gap-1 cursor-pointer hover:text-cyan-600">
            <Users className="w-4 h-4" />
            <span>Random</span>
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:text-cyan-600">
            <User className="w-4 h-4" />
            <span>Men</span>
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:text-cyan-600">
            <User className="w-4 h-4" />
            <span>Women</span>
          </div>
        </div>

        {/* Filter Button */}
        <button
          onClick={() => setShowFilterModal(true)}
          className="flex items-center gap-2 bg-cyan-400 text-white px-4 py-2 rounded-full hover:bg-cyan-500 text-sm font-medium shadow"
        >
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Filter Modal */}
      {showFilterModal && <FilterModal onClose={() => setShowFilterModal(false)} />}
    </>
  );
};

export default SearchFilterBar;
