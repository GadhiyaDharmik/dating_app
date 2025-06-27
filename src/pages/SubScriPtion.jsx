import React, { useState } from "react";
import { Switch, Button } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const PricingCard = ({
  title,
  description,
  features,
  isPremium,
  yearly,
  onToggle,
}) => {
  return (
    <div
      className={`rounded-[30px] shadow-xl px-8 py-8 w-full max-w-md flex flex-col items-center ${
        isPremium ? "bg-white" : "bg-white"
      } border`}
      style={{
        border: "0.6px solid #FFFFFF", // thin white border
        boxShadow: "0px 0px 20px 0px #00000026",
      }}
    >
      {/* Title & Subtext */}
      <h3
        className={`text-2xl font-bold ${
          isPremium ? "text-pink-500" : "text-blue-500"
        }`}
      >
        {title}
      </h3>
      <p className="text-xs mt-1 text-[#f77c7c]">{description}</p>

      {/* Price section with toggle */}
      <div className="w-full mt-4">
        <div
          className={`${
            isPremium
              ? "bg-gradient-to-r from-pink-400 to-pink-500"
              : "bg-gradient-to-r from-cyan-400 to-blue-500"
          } rounded-r-full px-4 py-4 text-white text-center text-sm font-semibold relative`}
        >
          <div className="text-[11px] mb-1 font-medium">
            Save up to 20% on yearly subscription
          </div>
          <div className="text-[13px] mb-2">
            1199.88 ILS/Year And 99.99 ILS/Month
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center justify-center mt-3">
            <span
              className={`text-xs font-semibold mr-2 ${
                yearly ? "text-white" : "text-white/60"
              }`}
            >
              Yearly
            </span>

            <div
              className="relative w-12 h-6 bg-white rounded-full flex items-center px-1 cursor-pointer"
              onClick={onToggle}
            >
              <div
                className={`w-5 h-5 ${
                  isPremium
                    ? "bg-gradient-to-r from-pink-400 to-pink-500"
                    : "bg-gradient-to-r from-cyan-400 to-blue-500"
                } rounded-full shadow-md transform transition-transform duration-300 ${
                  yearly ? "translate-x-0" : "translate-x-6"
                }`}
              ></div>
            </div>

            <span
              className={`text-xs font-semibold ml-2 ${
                !yearly ? "text-white" : "text-white/60"
              }`}
            >
              Monthly
            </span>
          </div>
        </div>
      </div>

      {/* Features */}
      <ul className="text-sm w-full space-y-2 mt-5">
        {features.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2">
            {item.included ? (
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center opacity-50 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(75.05deg, rgba(207, 45, 47, 0.8) 5.71%, #F4585A 58.75%)",
                }}
              >
                <CheckIcon sx={{ fontSize: 14, color: "#ffffff" }} />
              </div>
            ) : (
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(75.05deg, rgba(207, 45, 47, 0.8) 5.71%, #F4585A 58.75%)",
                }}
              >
                <CloseIcon sx={{ fontSize: 14, color: "#fff" }} />
              </div>
            )}
            <span>{item.label}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Button
        variant="contained"
        fullWidth
        sx={{
          mt: 4,
          bgcolor: isPremium ? "#ff4081" : "#2196f3",
          "&:hover": { bgcolor: isPremium ? "#f50057" : "#1976d2" },
          borderRadius: "2rem",
          fontWeight: "bold",
        }}
      >
        GET STARTED
      </Button>

      <p className="text-[11px] text-center text-gray-600 mt-2 leading-4">
        *Unlock also via kindness 💛 <br />
        <span className="text-blue-500 underline">You can cancel anytime</span>
      </p>
    </div>
  );
};

export default function SubscriptionPlans() {
  const [yearly, setYearly] = useState(true);

  const standardFeatures = [
    { label: "20 Swipes Daily Limit", included: true },
    { label: "Unlimited Favorites Access", included: true },
    { label: "Your Story Limited Access", included: true },
    { label: "Unlimited Profile Photos", included: true },
    { label: "Advanced Filter Option", included: true },
    { label: "Includes Chat Feature", included: true },
    { label: "No Audio Call", included: false },
    { label: "No Video Call", included: false },
  ];

  const premiumFeatures = [
    { label: "Unlimited Swipes", included: true },
    { label: "Unlimited Favorites Access", included: true },
    { label: "Full Story Access", included: true },
    { label: "Unlimited Profile Photos", included: true },
    { label: "Advanced AI Filter", included: true },
    { label: "Includes Chat Feature", included: true },
    { label: "Unlimited Audio Call", included: true },
    { label: "Unlimited Video Call", included: true },
  ];

  return (
    <div className="flex flex-col items-center py-10 px-4 bg-white min-h-screen">
      {/* Toggle */}
      <div className="flex justify-center mb-6">
        <div
          className="flex items-center bg-white shadow-md px-6 py-3 rounded-full space-x-4"
          style={{ boxShadow: "0px 0px 20px 0px #00000026" }}
        >
          {/* Yearly Label */}
          <span
            className={`text-sm font-semibold ${
              yearly ? "text-black" : "text-gray-400"
            }`}
          >
            Yearly
          </span>

          {/* Toggle Switch */}
          <div
            className="relative w-14 h-7 flex items-center cursor-pointer"
            onClick={() => setYearly(!yearly)}
          >
            {/* Background Track */}
            <div className="w-full h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-colors duration-300" />

            {/* Toggle Knob */}
            <div
              className={`absolute w-6 h-6 bg-white rounded-full shadow-md transform transition-all duration-300 ${
                yearly ? "left-1" : "right-1"
              }`}
            />
          </div>

          {/* Monthly Label */}
          <span
            className={`text-sm font-semibold ${
              !yearly ? "text-pink-500" : "text-gray-400"
            }`}
          >
            Monthly
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className="flex flex-col md:flex-row gap-8">
        <PricingCard
          title="Standard"
          description="For dreamers ready to find their match"
          price={
            yearly
              ? "1999.99 ₹/Year or 166.99 ₹/Month"
              : "999.99 ₹/6-Month or 166.99 ₹/Month"
          }
          features={standardFeatures}
          isPremium={false}
        />

        <PricingCard
          title="Premium"
          description="Designed for Emerging Love Seekers"
          price={
            yearly
              ? "3999.99 ₹/Year or 333.99 ₹/Month"
              : "1999.99 ₹/6-Month or 333.99 ₹/Month"
          }
          features={premiumFeatures}
          isPremium={true}
        />
      </div>
    </div>
  );
}
