import React, { useState, useEffect } from "react";
import { IconButton, Avatar } from "@mui/material";
import Mic from "@mui/icons-material/Mic";
import MicOff from "@mui/icons-material/MicOff";
import VolumeUp from "@mui/icons-material/VolumeUp";
import VolumeOff from "@mui/icons-material/VolumeOff";
import CallEnd from "@mui/icons-material/CallEnd";
import bgimg from "../../assets/bgimage.png"; // ✅ Must include extension

export default function VideoCallScreen() {
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")} : ${secs
      .toString()
      .padStart(2, "0")} min`;
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${bgimg})`,
      }}
    >
      {/* Avatar with blue ring */}
      {/* Avatar with perfect circular gradient and glow */}
      <div className="relative flex items-center justify-center w-48 h-48 overflow-visible">
        {/* Outer Glow - soft and perfectly round */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 blur-2xl opacity-60"></div>
        </div>

        {/* Gradient Ring */}
        <div className="relative z-10 w-40 h-40 rounded-full bg-gradient-to-tr from-[#00c6ff] to-[#0072ff] p-[6px] shadow-md">
          {/* Inner Black Circle */}
          <div className="rounded-full w-full h-full flex items-center justify-center p-[4px]">
            {/* Avatar */}
            <img
              src="https://randomuser.me/api/portraits/men/75.jpg"
              alt="User"
              className="rounded-full w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Online Status Dot */}
        <div className="absolute bottom-3 right-3 w-5 h-5 bg-green-500 rounded-full border-4 border-white z-20"></div>
      </div>

      {/* Name and Duration */}
      {/* Name and Duration - with spacing below avatar */}
      <div className="mt-7 text-center">
        <h2 className="text-xl font-bold text-black">Michael Dam</h2>
        <p className="text-gray-600 mt-1 text-sm">
          Call Duration: {formatDuration(callDuration)}
        </p>
      </div>

      {/* Controls */}
      <div className="mt-8 bg-white rounded-full px-6 py-3 flex items-center justify-between gap-10 shadow-md w-80 sm:w-96 md:w-[400px]">
        {/* Volume */}
        <IconButton onClick={() => setIsSpeakerOn(!isSpeakerOn)}>
          {isSpeakerOn ? (
            <VolumeUp className="text-cyan-600" />
          ) : (
            <VolumeOff className="text-cyan-600" />
          )}
        </IconButton>

        {/* Mic */}
        <IconButton onClick={() => setIsMuted(!isMuted)}>
          {isMuted ? (
            <MicOff className="text-cyan-600" />
          ) : (
            <Mic className="text-cyan-600" />
          )}
        </IconButton>

        {/* End Call */}
        <IconButton
          onClick={() => alert("Call Ended")}
          className="!bg-red-500 hover:!bg-red-600 !text-white !w-12 !h-12"
        >
          <CallEnd />
        </IconButton>
      </div>
    </div>
  );
}
