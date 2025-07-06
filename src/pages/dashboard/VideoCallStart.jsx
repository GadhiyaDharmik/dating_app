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
      const videoTrack = localStream.find(
        (track) => track.getTrack && track.getTrack().kind === "video"
      );
      if (videoTrack) {
        const localContainer = document.getElementById("local-video");
        if (localContainer) videoTrack.play(localContainer);
      }
    }

    // Play remote video
    if (Array.isArray(remoteStream)) {
      const videoTrack = remoteStream.find(
        (track) => track.getTrack && track.getTrack().kind === "video"
      );
      if (videoTrack) {
        const remoteContainer = document.getElementById("remote-video");
        if (remoteContainer) {
          remoteContainer.innerHTML = "";
          const div = document.createElement("div");
          div.style.width = "100%";
          div.style.height = "100%";
          remoteContainer.appendChild(div);
          videoTrack.play(div);
        }
      }
    }
  }, [localStream, remoteStream]);

  return (
    <div className="relative w-[50%] h-full flex flex-col items-center justify-center">
      {/* Remote Video Fullscreen */}
      <div
        id="remote-video"
        className="w-full h-full bg-black rounded-md overflow-hidden"
      />

      {/* Local Video Floating */}
      <div
        id="local-video"
        className="absolute bottom-24 right-4 w-40 h-28 bg-black rounded-md overflow-hidden border border-white shadow-lg"
      />

      {/* Call Controls */}
      <div className="absolute bottom-4 bg-white rounded-full px-6 py-3 flex items-center justify-between gap-6 shadow-md">
        <IconButton className="text-cyan-600">
          <Volume1 size={24} />
        </IconButton>
        <IconButton className="text-cyan-600" onClick={() => onToggleMute?.(false)}>
          <Mic size={24} />
        </IconButton>
        {/* <IconButton className="text-cyan-600" onClick={() => onToggleMute?.(true)}>
          <MicOff size={24} />
        </IconButton> */}
        <IconButton className="text-cyan-600">
          <Video size={24} />
        </IconButton>
        {/* <IconButton className="text-cyan-600">
          <VideoOff size={24} />
        </IconButton> */}
        {/* <IconButton className="text-cyan-600">
          <RefreshCcw size={24} />
        </IconButton> */}
        <IconButton
          onClick={onEndCall}
          className="!bg-red-500 hover:!bg-red-600 !text-white !w-10 !h-10"
        >
          <PhoneMissed size={24} />
        </IconButton>
      </div>
    </div>
  );
};

export default VideoCallStart;