// src/components/StarRatingBar.jsx

import { Info, Bell, ChevronDown, Heart, Crown } from "lucide-react";
import logo from "../assets/blueheart.png";
import { useState } from "react";

export const GradientHeart = ({ filled }) => (
  <div className="relative w-10 h-10">
    <svg width="40" height="40" viewBox="0 0 24 24" className="absolute inset-0">
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D8B65E" />
          <stop offset="50%" stopColor="#FEF18B" />
          <stop offset="100%" stopColor="#B37D33" />
        </linearGradient>
      </defs>
      <Heart
        fill={filled ? "url(#goldGradient)" : "#E5E7EB"}
        strokeWidth={0}
        className="w-full h-full"
      />
    </svg>
    <img
      src={logo}
      alt="logo inside heart"
      className="absolute inset-0 w-5 h-5 m-auto rounded-full object-cover z-10"
    />
  </div>
);

export const HeartRating = () => {
  const [rating, setRating] = useState(3);

  return (
    <div className="text-center">
      <div className="flex gap-2 px-4 justify-center">
        {[1, 2, 3, 4, 5].map((star, index) => (
          <div key={index} onClick={() => setRating(star)} className="cursor-pointer">
            <GradientHeart filled={star <= rating} />
          </div>
        ))}
      </div>
      <span className="text-xs">
        Michael Dam has earned {rating} out of 5 LoveAi hearts for volunteering & good deeds
      </span>
    </div>
  );
};

const StarRatingBar = () => {
  return (
    <div className="w-full flex justify-between items-center p-4 pr-8 bg-white shadow h-[14vh]">
      <div className="flex flex-col">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
          <span className="text-[12px] font-bold ">Good deeds points</span>
          <Info className="w-3 h-3 text-gray-500 text-[10px]" />
        </div>
        <HeartRating />
      </div>

      <div className="flex items-center gap-4">
        <button className="flex bg-gradient-to-l from-[#FF9999] to-[#FFC5C5] rounded-2xl py-2 px-5 text-white font-medium shadow-md">
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
