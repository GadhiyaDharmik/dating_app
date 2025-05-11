import React, { useState } from "react";
import MainSignUp from "../component/MainSignUp";
import secondBG from "../assets/secondBG.png";
import { HeartHandshake, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

function IdealMatchPage() {
  const navigate = useNavigate()
  return (
    <MainSignUp
      titleText=" "
      text="It will Display on your Profile and you will not able to change it later"
      hasButton={true}
      buttonText="Find Your Match"
      onButtonClick={(() => navigate("/dashboard/home"))}
    >
      <IdealMatchComponent />
    </MainSignUp>
  );
}

const matchTypes = [
  {
    label: "Relationship",
    emoji: <HeartHandshake size={36} className="text-pink-500" />,
    value: "relationship",
    label2: "Looking for love and commitment",
  },
  {
    label: "Friendship",
    emoji: <Users size={36} className="text-blue-500" />,
    value: "friendship",
    label2: "Looking for casual connections and fun",
  },
];

function IdealMatchComponent() {
  const [selectedMatch, setSelectedMatch] = useState("");

  return (
    <div
      className="w-full min-h-[60vh] bg-cover bg-center p-6 flex flex-col items-center justify-center rounded-xl"
      style={{ backgroundImage: `url(${secondBG})` }}
    >
      <div className="max-w-xl w-full bg-white bg-opacity-90 p-6 rounded-2xl backdrop-blur-md">
        <h2 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-6">
          Select Your Ideal Match
        </h2>

        {/* Match Type */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">
            What are you looking for?
          </h3>
          <div className="flex justify-center gap-5">
            {matchTypes.map((match) => (
              <div className="text-center">
                <div
                  key={match.value}
                  onClick={() => setSelectedMatch(match.value)}
                  className={`flex flex-col items-center gap-2 cursor-pointer px-6 py-4 rounded-xl transition-all duration-300 
                  ${selectedMatch === match.value
                      ? "bg-pink-100 border-2 border-pink-400"
                      : "bg-white border border-gray-300"
                    }`}
                >
                  {match.emoji}
                  <p className="text-sm font-medium text-gray-700">
                    {match.label}
                  </p>
                </div>
                {match.label2}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default IdealMatchPage;
