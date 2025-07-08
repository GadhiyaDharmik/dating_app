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
import pencil from "../assets/pencil.svg";
import usericon from "../assets/userimg.svg";
import verified from "../assets/verified.svg";
import { useNavigate } from "react-router-dom";
import axiosInspector from "../http/axiosMain";
import { useAboutContext } from "../utils/AboutContext";

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
  { label: "Personal Information", icon: <User size={18} />, navigate: "/dashboard/personalInfo" },
  { label: "Privacy & Permission", icon: <Lock size={18} /> },
  { label: "Security", icon: <Shield size={18} /> },
  { label: "Data & Storage", icon: <Database size={18} /> },
  { label: "Feedback", icon: <MessageSquare size={18} /> },
  { label: "Language", icon: <Globe size={18} /> },
  { label: "About Love AI", icon: <Info size={18} />, disabled: true },
];

const Sidebar = () => {
  const { setShowAbout, setAboutData } = useAboutContext();

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
    <div className="h-screen w-72 bg-[linear-gradient(90deg,_#00D4FF_0%,_#00A3E0_100%)] text-white flex flex-col rounded-r-[30px] shadow-xl sidebar-con overflow-auto">
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
          <img src={pencil} alt="pencil" />
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
          {/* <User size={14} /> */}
          <img src={usericon} alt="user icon" />
        </div>
      </div>

      {/* Name & Email */}
      <div className="text-center mb-2">
        <div className="flex items-center justify-center gap-1 font-semibold">
          {userName}
          <div className="bg-white rounded-full p-1">
            <img src={verified} alt="verified icon" className="w-3 h-3" />
          </div>
        </div>
        <p className="text-xs text-white/90">{userEmail}</p>
      </div>

      {/* Scrollable Nav List */}
      <div className="flex flex-col w-full" style={{ padding: "10px 0px 0px 20px" }}>
        {navItems.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              if (!item.disabled) {
                setShowAbout(false)
                setAboutData(null)
                setActive(index);
                item.navigate && navigate(item.navigate);

              }
            }}
            className={`${active === index ? "bg-black/5 rounded-l-2xl" : "text-white/90"
              } ${active - 1 === index ? "bg-black/5" : ""} ${active + 1 === index ? "bg-black/5" : ""
              }`}
          >
            <div
              className={`group flex items-center gap-3 px-4 py-4 cursor-pointer transition-all duration-300 relative overflow-hidden pl-10 shadow-none sidebar-text
          ${active === index ? "rounded-l-2xl" : "bg-[linear-gradient(90deg,_#00D4FF_0%,_#00A3E0_100%)] text-white/90"}
          ${active - 1 === index ? "bg-[linear-gradient(90deg,_#00D4FF_0%,_#00A3E0_100%)] rounded-br-4xl" : ""}
          ${active + 1 === index ? "bg-[linear-gradient(90deg,_#00D4FF_0%,_#00A3E0_100%)] rounded-tr-4xl" : ""}
        `}
            >
              <span className="z-10">{item.icon}</span>
              <span className="z-10 text-sm font-medium">{item.label}</span>
            </div>
          </div>
        ))}
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
