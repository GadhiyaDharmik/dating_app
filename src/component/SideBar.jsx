import React, { useState, useRef } from "react";
import {
  Home,
  Heart,
  MessageCircle,
  User,
  Lock,
  Shield,
  Database,
  MessageSquare,
  Globe,
  Info,
  LogOut,
} from "lucide-react";
import logo from "../assets/LOGO.svg";
import userImg from "../assets/bgImage.png";
import { useNavigate } from "react-router-dom";
import axiosInspector from "../http/axiosMain";

const navItems = [
  { label: "Home", icon: <Home size={18} />, navigate: "/dashboard/home" },
  {
    label: "Matches",
    icon: <Heart size={18} />,
    navigate: "/dashboard/matches",
  },
  {
    label: "Messages",
    icon: <MessageCircle size={18} />,
    navigate: "/dashboard/messages",
  },
  { label: "Personal Information", icon: <User size={18} /> },
  { label: "Privacy & Permission", icon: <Lock size={18} /> },
  { label: "Security", icon: <Shield size={18} /> },
  { label: "Data & Storage", icon: <Database size={18} /> },
  { label: "Feedback", icon: <MessageSquare size={18} /> },
  { label: "Language", icon: <Globe size={18} /> },
  { label: "About Love AI", icon: <Info size={18} />, disabled: true },
];

const Sidebar = () => {
  const [active, setActive] = useState(() => {
    const foundIndex = navItems.findIndex(
      (item) => item.navigate === location.pathname
    );
    return foundIndex !== -1 ? foundIndex : 0;
  });

  const [previewImg, setPreviewImg] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const userData = JSON.parse(localStorage.getItem("user_Data")) || {};
  const userId = userData?.id;
  const userName = userData.name || "Michael Dam";
  const userEmail = userData.email || "michaeldam@loveai.com";

  // ✅ Use .url from localStorage
  const profileImg = previewImg || userData.url || userImg;

  const handleEditClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file || !userId) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      setPreviewImg(reader.result); // Show preview immediately

      const token = localStorage.getItem("access_token");
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await axiosInspector.put(
          `/users/${userId}/media?media=Profile`,
          formData,
          {
            headers: {
              token,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // ✅ Get updated image URL from server response if available
        const updatedUrl = res?.data?.url || reader.result;

        // ✅ Update localStorage user_Data with new URL
        const updatedUserData = { ...userData, url: updatedUrl };
        localStorage.setItem("user_Data", JSON.stringify(updatedUserData));

        setPreviewImg(updatedUrl);
        alert("✅ Profile image updated.");
      } catch (error) {
        console.error("Upload failed:", error.response || error);
        alert("Failed to update profile image.");
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="h-screen w-72 bg-gradient-to-b from-[#00A3E0] to-[#00D4FF] text-white flex flex-col rounded-r-[30px] shadow-xl">
      {/* Logo */}
      <div className="flex flex-col items-center pt-6">
        <img src={logo} alt="Logo" className="mb-6" />
      </div>

      {/* Profile Section */}
      <div className="relative flex flex-col items-center mb-4">
        <div className="rounded-full p-[5px] bg-[#90e6ff] w-[100px] h-[100px] flex items-center justify-center shadow-md relative">
          <img
            src={profileImg}
            alt="Profile"
            className="w-[84px] h-[84px] rounded-full object-cover border-2 border-white"
          />
          {/* Green Status Dot */}
          <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-[3px] border-white" />
        </div>

        {/* Pencil Icon */}
        <div
          className="absolute top-1 right-[calc(50%-55px)] bg-[#FF6D9E] p-[6px] rounded-full shadow-md cursor-pointer"
          onClick={handleEditClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="text-white w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z"
            />
          </svg>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {/* People Icon */}
        <div className="absolute bottom-0 right-[calc(50%-50px)] bg-white text-[#00A3E0] p-[6px] rounded-full shadow-md">
          <User size={14} />
        </div>
      </div>

      {/* Name & Email */}
      <div className="text-center mb-2">
        <div className="flex items-center justify-center gap-1 font-semibold">
          {userName}
        </div>
        <p className="text-xs text-white/90">{userEmail}</p>
      </div>

      {/* Scrollable Nav List */}
      <div className="flex-1 overflow-y-auto px-4 custom-scroll">
        <div className="space-y-2 pb-4">
          {navItems.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                if (!item.disabled) {
                  setActive(index);
                  item.navigate && navigate(item.navigate);
                }
              }}
              className={`flex items-center gap-3 px-4 py-3 text-sm cursor-pointer transition-all
                ${item.disabled ? "opacity-30 cursor-not-allowed" : ""}
                ${
                  active === index
                    ? "bg-white/30 text-white font-semibold rounded-l-[999px]"
                    : "hover:bg-white/10 text-white/80 rounded-l-[999px] duration-200"
                }
              `}
            >
              {item.icon}
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-6 py-4">
        <button
          className="w-full flex items-center justify-center gap-2 py-2 rounded-full bg-white text-red-500 font-semibold hover:bg-red-100 transition"
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
        >
          <LogOut size={16} />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
