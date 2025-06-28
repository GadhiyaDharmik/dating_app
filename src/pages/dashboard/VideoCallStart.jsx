import React from "react";
import { IconButton } from "@mui/material";
import { Mic, PhoneMissed, RefreshCcw, Video, Volume1 } from "lucide-react";

export default function VideoCallStart() {
  return (
    <div className="w-full h-screen relative bg-black overflow-hidden">
      {/* Full screen video (caller) */}
      <img
        src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1920&q=80"
        alt="Caller"
        className="w-full h-full object-cover"
      />

      {/* Self view (bottom right) */}
      <div className="absolute bottom-6 right-6 w-32 h-40 rounded-lg overflow-hidden shadow-lg border-2 border-white z-20">
        <img
          src="https://randomuser.me/api/portraits/men/75.jpg"
          alt="Self"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Control Panel (center bottom) */}
      {/* Control Panel */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-full px-6 py-2 flex items-center justify-between gap-4 shadow-md">
        <IconButton className="text-cyan-600">
          <Volume1 color="#00A3E0" size={32} />{" "}
        </IconButton>

        <IconButton className="text-cyan-600">
          <Mic color="#00A3E0" size={32} />{" "}
        </IconButton>

        <IconButton className="text-cyan-600">
          <Video color="#00A3E0" size={32} />{" "}
        </IconButton>

        <IconButton className="text-cyan-600">
          <RefreshCcw color="#00A3E0" size={32} />{" "}
        </IconButton>

        <IconButton className="!bg-red-500 hover:!bg-red-600 !text-white !w-10 !h-10">
          <PhoneMissed size={32} color="#FFFFFF" strokeWidth={1.75} />{" "}
        </IconButton>
      </div>
    </div>
  );
}
