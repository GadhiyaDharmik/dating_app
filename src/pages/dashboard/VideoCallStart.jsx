// VideoCallStart.jsx (updated based on your structure)
import React, { useEffect } from "react";
import { IconButton } from "@mui/material";
import {
  Mic,
  MicOff,
  PhoneMissed,
  RefreshCcw,
  Video,
  VideoOff,
  Volume1,
} from "lucide-react";

const VideoCallStart = ({
  onEndCall,
  onToggleMute,
  localStream,
  remoteStream,
}) => {
  useEffect(() => {
    // Play local video
    if (Array.isArray(localStream)) {
      const videoTrack = localStream.find((track) => track.getTrack && track.getTrack().kind === "video");
      if (videoTrack) {
        const localContainer = document.getElementById("local-video");
        videoTrack.play(localContainer);
      }
    }

    // Play remote video
    if (Array.isArray(remoteStream)) {
      const videoTrack = remoteStream.find((track) => track.getTrack && track.getTrack().kind === "video");
      if (videoTrack) {
        const remoteContainer = document.getElementById("remote-videos");
        remoteContainer.innerHTML = ""; // Clear old tracks if any
        const div = document.createElement("div");
        div.style.width = "100%";
        div.style.height = "300px";
        remoteContainer.appendChild(div);
        videoTrack.play(div);
      }
    }
  }, [localStream, remoteStream]);

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div
        id="local-video"
        style={{ width: "100%", height: "300px", backgroundColor: "#000" }}
        className="rounded-md overflow-hidden"
      />
      <div
        id="remote-videos"
        className="mt-4 w-full rounded-md overflow-hidden"
        style={{ minHeight: "300px", backgroundColor: "#000" }}
      />

      {/* Controls */}
      <div className="mt-6 bg-white rounded-full px-6 py-3 flex items-center justify-between gap-6 shadow-md">
        <IconButton className="text-cyan-600">
          <Volume1 size={32} />
        </IconButton>

        <IconButton className="text-cyan-600" onClick={() => onToggleMute?.(false)}>
          <Mic size={32} />
        </IconButton>

        <IconButton className="text-cyan-600" onClick={() => onToggleMute?.(true)}>
          <MicOff size={32} />
        </IconButton>

        <IconButton className="text-cyan-600">
          <Video size={32} />
        </IconButton>

        <IconButton className="text-cyan-600">
          <VideoOff size={32} />
        </IconButton>

        <IconButton className="text-cyan-600">
          <RefreshCcw size={32} />
        </IconButton>

        <IconButton
          onClick={onEndCall}
          className="!bg-red-500 hover:!bg-red-600 !text-white !w-10 !h-10"
        >
          <PhoneMissed size={32} />
        </IconButton>
      </div>
    </div>
  );
};

export default VideoCallStart;
