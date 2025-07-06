// src/components/StarRatingBar.jsx

import { Info, Bell, ChevronDown, Heart, Crown } from "lucide-react";
import GoldHeart from "../assets/golder heart.svg";
import BlankHeart from "../assets/blank heart.svg";
import PinkHeart from "../assets/pink heart logo.svg";
import BlueHeart from "../assets/blue heart.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const GradientHeart = ({ filled }) => {
  return (
    <div className="relative w-10 h-10">
      {filled ? (
        <>
          {/* Gold heart image as base */}
          <img
            src={GoldHeart} // heart shape image with gold theme
            alt="gold heart background"
            className="w-full h-full absolute inset-0 object-contain"
          />
          {/* Blue logo inside heart */}
          <img
            src={BlueHeart}
            alt="logo inside gold heart"
            className="absolute inset-0 w-5 h-5 m-auto rounded-full object-cover z-10"
          />
        </>
      ) : (
        <>
          {/* Blank heart image */}
          <img
            src={BlankHeart}
            alt="blank heart background"
            className="w-full h-full absolute inset-0 object-contain"
          />
          {/* Pink logo inside heart */}
          <img
            src={PinkHeart}
            alt="logo inside blank heart"
            className="absolute inset-0 w-5 h-5 m-auto rounded-full object-cover z-10"
          />
        </>
      )}
    </div>
  );
};

export const HeartRating = () => {
  const [rating, setRating] = useState(3);
  const userData = JSON.parse(localStorage.getItem("user_Data")) || {};
  const userId = userData?.id;
  const userName = userData.name || "Michael Dam";
  const userEmail = userData.email || "michaeldam@loveai.com";

  return (
    <div className="text-center">
      <div className="flex gap-2 px-4 justify-center">
        {[1, 2, 3, 4, 5].map((star, index) => (
          <div
            key={index}
            onClick={() => setRating(star)}
            className="cursor-pointer"
          >
            <GradientHeart filled={star <= rating} />
          </div>
        ))}
      </div>
      <span className="text-xs">
        {userName} has earned {rating} out of 5 LoveAi hearts for volunteering &
        good deeds
      </span>
    </div>
  );
};

const StarRatingBar = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/dashboard/subscription");
  };
  return (
    <div className="w-full flex justify-between items-center p-4 pr-8 bg-white shadow h-[14vh] mb-4">
      <div className="flex flex-col">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
          <span className="text-[12px] font-bold ">Good deeds points</span>
          <Info className="w-3 h-3 text-gray-500 text-[10px]" />
        </div>
        <HeartRating />
      </div>

      <div className="flex items-center gap-4">
        <button className="flex bg-gradient-to-l from-[#FF9999] to-[#FFC5C5] rounded-2xl py-2 px-5 text-white font-medium shadow-md" onClick={handleClick}
        >

          <Crown className="mr-2" />

          Upgrade Now

        </button>

        <div className="relative">
          <Bell className="w-10 h-11 text-white bg-cyan-500 p-2 rounded-full" />
          <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
            1
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-700 font-medium cursor-pointer">
          English (UK)
          <ChevronDown className="w-4 h-4 ml-1 text-gray-500" />
        </div>
      </div>
    </div>
  );
};

export default StarRatingBar;
