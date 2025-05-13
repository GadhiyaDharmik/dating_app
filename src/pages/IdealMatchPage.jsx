import React, { useState } from "react";
import MainSignUp from "../component/MainSignUp";
import secondBG from "../assets/secondBG.png";
import friendshipIcon from "../assets/friendshipIcon.png";
import relationshipIcon from "../assets/relationshipIcon.png";
import { HeartHandshake, Users } from "lucide-react";
import { useNavigate } from 'react-router-dom';

function IdealMatchPage() {
  const navigate = useNavigate()
  return (
    <MainSignUp
      titleText=" "
      text="It will display on your profile and you will not be able to change it later"
      hasButton={true}
      buttonText="Find Your Match"
      onButtonClick={() => navigate("/dashboard/home")}
    >
      <IdealMatchComponent />
    </MainSignUp>
  );
}

const matchTypes = [
  {
    label: "Relationship",
    emoji: <HeartHandshake size={36} className="text-pink-500" />,
    value: "LoveCommitment",
    label2: "Looking for love and commitment",
    color1: "from-[#F4585A]",
    color2: "to-[#CF2D2F]/80",
    icon: relationshipIcon,
  },
  {
    label: "Friendship",
    emoji: <Users size={36} className="text-blue-500" />,
    value: "CasualFun",
    label2: "Looking for casual connections and fun",
    color1: "from-[#00A3E0]",
    color2: "to-[#00D4FF]",
    icon: friendshipIcon,
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

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">
            What are you looking for?
          </h3>
          <div className="flex justify-center gap-5">
            {matchTypes.map((match) => (
              <div key={match.value} className="text-center">
                <div
                  onClick={() => setSelectedMatch(match.value)}
                  className={`relative bg-gradient-to-b ${match.color1} ${match.color2} rounded-2xl p-5 h-44 w-44 cursor-pointer transition-all duration-300 ${selectedMatch === match.value ? "scale-105 shadow-lg" : "opacity-90"
                    }`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center shadow-lg">
                      <img
                        src={match.icon}
                        alt={`${match.label} Icon`}
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-md font-semibold text-gray-800">{match.label}</p>
                <p className="text-sm text-gray-600 max-w-xs mx-auto">{match.label2}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


export default IdealMatchPage;
