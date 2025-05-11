import { X } from "lucide-react";

const FilterModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-end">
      <div className="bg-white w-full sm:w-[420px] h-full shadow-lg px-6 py-4 overflow-y-auto rounded-l-xl">
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

        {/* Search Preferences */}
        <FilterSection label="Search Preferences" options={["Male", "Female", "Random"]} selected={["Female"]} />

        {/* Interests */}
        <FilterSection
          label="Interests"
          options={["Travel", "Cooking", "Hiking", "Yoga", "Gaming", "Movies", "Books", "Animals", "Wine", "Comedy", "Football", "Meditation", "Pet allowed"]}
          selected={["Cooking", "Animals"]}
        />

        {/* Languages I Know */}
        <FilterSection
          label="Languages I Know"
          options={["English", "Gujarati", "Hindi", "Bengali", "Portuguese", "Russian", "Japanese", "Turkish", "French", "Korean", "German", "Vietnamese"]}
          selected={["Gujarati", "Turkish"]}
        />

        {/* Religion */}
        <FilterSection
          label="Religion"
          options={["Casual", "Friendship", "Dating", "Buddhism", "Judaism", "Sikhism", "Taoism", "Jainism", "Shintoism", "Bahá'í Faith", "Zoroastrianism"]}
          selected={["Friendship"]}
        />

        {/* Relationship Goals */}
        <FilterSection
          label="Relationship Goals"
          options={["Casual", "Friendship", "Serious Relationship", "Open to Options", "Networking", "Exploration"]}
          selected={["Friendship"]}
        />

        {/* Verify Profile */}
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

// Subcomponent to render labeled sections with pill buttons
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

export default FilterModal;
