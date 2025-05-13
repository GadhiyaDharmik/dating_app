import React, { useState } from "react";
import {
  Home,
  Heart,
  MessageCircle,
  User,
  Lock,
  Bell,
  Shield,
  Database,
  MessageSquare,
  Globe,
  Info,
  LogOut,
  Power,
} from "lucide-react";
import logo from "../assets/logoFull.png";
import userImg from "../assets/bgImage.png";
import { useNavigate } from "react-router-dom";

const navItems = [
  { label: "Home", icon: <Home size={18} />, navigate: "/dashboard/home" },
  { label: "Matches", icon: <Heart size={18} /> },
  {
    label: "Messages",
    icon: <MessageCircle size={18} />,
    navigate: "/dashboard/messages",
  },
  { label: "Personal Information", icon: <User size={18} /> },
  { label: "Privacy & Permission", icon: <Lock size={18} /> },
  { label: "Notification", icon: <Bell size={18} /> },
  { label: "Security", icon: <Shield size={18} /> },
  { label: "Data & Storage", icon: <Database size={18} /> },
  { label: "Feedback", icon: <MessageSquare size={18} /> },
  { label: "Language", icon: <Globe size={18} /> },
  { label: "About Love AI", icon: <Info size={18} /> },
];

const Sidebar = () => {
  const [active, setActive] = useState(0);
  // const [isActivated, setIsActivated] = useState(true); // ✅ toggle status
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("user_Data")) || {};
  const userName = userData.name || "Guest User";
  const userEmail = userData.email || "guest@example.com";
  const profileImg = userData.profile_picture || userImg;

  // Load from localStorage on mount
  // useEffect(() => {
  //   const savedStatus = localStorage.getItem("isActivated");
  //   if (savedStatus !== null) {
  //     setIsActivated(savedStatus === "true");
  //   }
  // }, []);

  return (
    <div className="h-screen w-72 bg-[#00A3E0] text-white flex flex-col items-center py-6 shadow-lg rounded-r-2xl">
      {/* Logo */}
      <img src={logo} alt="Logo" className="h-10 mb-6" />

      {/* Profile Section */}
      <div className="flex flex-col items-center mb-8">
        <img
          src={profileImg}
          alt="Profile"
          className="w-20 h-20 rounded-full border-4 border-white shadow-md"
        />
        <h2 className="mt-3 font-semibold text-lg">{userName}</h2>
        <p className="text-sm opacity-90">{userEmail}</p>
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col w-full">
        {navItems.map((item, index) => (
          <div
            key={index}
            className={`cursor-pointer px-4 py-2 flex items-center gap-3 ${active === index ? "bg-black/10" : "hover:bg-white/10"
              }`}
            onClick={() => {
              setActive(index);
              if (item.navigate) navigate(item.navigate);
            }}
          >
            <span>{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <div className="mt-auto w-full px-4">
        <button
          className="w-full flex items-center justify-center gap-2 py-2 mt-6 rounded-full bg-white text-red-500 font-semibold hover:bg-red-100 transition"
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
