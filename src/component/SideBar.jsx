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
} from "lucide-react";
import logo from "../assets/logoFull.png"; // your logo
import userImg from "../assets/bgImage.png"; // your profile image
import { useNavigate } from "react-router-dom";

const navItems = [
  { label: "Home", icon: <Home size={18} /> },
  { label: "Matches", icon: <Heart size={18} /> },
  { label: "Messages", icon: <MessageCircle size={18} />, navigate: "/dashboard/messages" },
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
  const navigate = useNavigate()

  return (
    <div className="h-screen w-72 bg-[#00A3E0] text-white flex flex-col items-center py-6 shadow-lg rounded-r-2xl">
      {/* Logo */}
      <img src={logo} alt="Logo" className="h-10 mb-6" />

      {/* Profile Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <img
            src={userImg}
            alt="Profile"
            className="w-20 h-20 rounded-full border-4 border-white shadow-md"
          />
        </div>
        <h2 className="mt-3 font-semibold text-lg">Michael Dam</h2>
        <p className="text-sm opacity-90">michaeldam@loveai.com</p>
      </div>

      {/* Nav Items */}
      <div className="flex flex-col w-full">
        {navItems.map((item, index) => (
          <div
            className={`${active === index
              ? "bg-black/5  rounded-l-2xl"
              : "text-white/90 "
              }
          ${active - 1 === index ? "bg-black/5 " : ""}
          ${active + 1 === index ? "bg-black/5 " : ""}`}
            onClick={() => navigate("/dashboard/messages")}
          >
            <div
              key={item.label}
              onClick={() => setActive(index)}
              className={`group flex items-center gap-3 px-4 py-2 cursor-pointer transition-all duration-300 relative overflow-hidden pl-10 shadow-none
              ${active === index
                  ? "rounded-l-2xl"
                  : "bg-[#00A3E0] text-white/90"
                }
              ${active - 1 === index ? "bg-[#00A3E0] rounded-br-4xl" : ""}
              ${active + 1 === index ? "bg-[#00A3E0] rounded-tr-4xl" : ""}
              
                `}
            >
              <span className="z-10">{item.icon}</span>
              <span className="z-10 text-sm font-medium">{item.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Log Out Button */}
      <div className="mt-auto w-full px-4">
        <button className="w-full flex items-center justify-center gap-2 py-2 mt-6 rounded-full bg-white text-red-500 font-semibold hover:bg-red-100 transition">
          <LogOut size={16} />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
