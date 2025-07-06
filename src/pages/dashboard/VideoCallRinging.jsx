import React, { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import Mic from "@mui/icons-material/Mic";
import MicOff from "@mui/icons-material/MicOff";
import VolumeUp from "@mui/icons-material/VolumeUp";
import VolumeOff from "@mui/icons-material/VolumeOff";
import CallEnd from "@mui/icons-material/CallEnd";
import bgimg from "../../assets/bgImage.png";
import { PhoneCall } from "lucide-react";
import VideoCallStart from "./VideoCallStart";

export default function VideoCallScreen({
  onEndCall,
  onToggleMute,
  type,
  acceptCall,
  rejectCall,
  callStatus, isCaller, receiverDetail,
  isVideo,
  localStream,
  remoteStream
}) {
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [videoCallStarted, setVideoCallStarted] = useState(false);
  const UserDetail = JSON.parse(localStorage.getItem("user_Data"));



  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);


  useEffect(() => {
    if (callStatus === "ongoing" && isVideo) {
      setVideoCallStarted(true);
    }
  }, [callStatus, isVideo]);


  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")} : ${secs
      .toString()
      .padStart(2, "0")} min`;
  };

  return (
    <div
      className={`w-full h-full rounded-2xl flex flex-col items-center justify-center py-${type !== "call_invitation" && isVideo ? "0" : "8"} bg-cover bg-center bg-no-repeat`}
      style={{
        backgroundImage: `url(${bgimg})`,
      }}
    >
      {/* <div className="w-full h-full"> */}
      {(callStatus === "calling" && !isCaller) && <p className="text-lg font-semibold text-black mb-5">Incoming {isVideo ? "Video" : "Audio"} Call</p>}
      {/* Avatar with glowing ring */}
      {(callStatus === "calling" || !isVideo) && <div className="relative flex items-center justify-center w-48 h-48 overflow-visible">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 blur-2xl opacity-60"></div>
        </div>


        <div className="relative z-10 w-40 h-40 rounded-full bg-gradient-to-tr from-[#00c6ff] to-[#0072ff] p-[6px] shadow-md">
          <div className="rounded-full w-full h-full flex items-center justify-center p-[4px]">
            <img
              src={callStatus === "calling" && isCaller ? UserDetail?.url || "https://randomuser.me/api/portraits/men/75.jpg" : receiverDetail?.user?.url || "https://randomuser.me/api/portraits/men/75.jpg"}
              alt="User"
              className="rounded-full w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="absolute bottom-3 right-3 w-5 h-5 bg-green-500 rounded-full border-4 border-white z-20"></div>
      </div>}

      {(callStatus === "calling" && isCaller) ? (
        <>
          <h2 className="text-xl font-bold text-black">{UserDetail?.name || "Michael Dam"}</h2>

          <div className="mt-4 text-center">
            <p className="text-lg font-semibold text-black">Calling...</p>
          </div>
        </>
      ) : (
        <>
          {(type !== "call_invitation" && !isVideo) &&
            <h2 className="text-xl font-bold text-black">{receiverDetail?.user?.name || "Michael Dam"}</h2>}

          {(type !== "call_invitation" && !isVideo) && (<div className="mt-7 text-center">

            <p className="text-gray-600 mt-1 text-sm">
              Call Duration: {formatDuration(callDuration)}
            </p>
          </div>)}
          {/* Controls */}
          {isVideo ?

            <>
              {(type !== "call_invitation") && (<VideoCallStart
                onEndCall={onEndCall}
                onToggleMute={onToggleMute}
                localStream={localStream}
                remoteStream={remoteStream} />)}

              {/* // You can pass remoteUsers, localTrack if available */}
              {(type === "call_invitation" && isVideo) && (
                <div className="mt-8 bg-white rounded-full px-6 py-3 flex items-center justify-between gap-10 shadow-md w-80 sm:w-96 md:w-[400px]">
                  {type === "call_invitation" && (
                    <IconButton
                      onClick={acceptCall}
                      className="!bg-green-500 hover:!bg-green-600 !text-white !w-12 !h-12"
                    >
                      <PhoneCall />
                    </IconButton>
                  )}

                  <IconButton
                    onClick={() => {
                      onEndCall?.();
                      rejectCall?.();
                    }}
                    className="!bg-red-500 hover:!bg-red-600 !text-white !w-12 !h-12"
                  >
                    <CallEnd />
                  </IconButton>
                </div>)}
            </> :
            <div className="mt-8 bg-white rounded-full px-6 py-3 flex items-center justify-between gap-10 shadow-md w-80 sm:w-96 md:w-[400px]">
              {(type !== "call_invitation") && (
                <>
                  <IconButton onClick={() => setIsSpeakerOn(!isSpeakerOn)}>
                    {isSpeakerOn ? (
                      <VolumeUp className="text-cyan-600" />
                    ) : (
                      <VolumeOff className="text-cyan-600" />
                    )}
                  </IconButton>

                  <IconButton
                    onClick={() => {
                      const newMuted = !isMuted;
                      setIsMuted(newMuted);
                      onToggleMute?.(newMuted);
                    }}
                  >
                    {isMuted ? (
                      <MicOff className="text-cyan-600" />
                    ) : (
                      <Mic className="text-cyan-600" />
                    )}
                  </IconButton>
                </>
              )}

              {type === "call_invitation" && (
                <IconButton
                  onClick={acceptCall}
                  className="!bg-green-500 hover:!bg-green-600 !text-white !w-12 !h-12"
                >
                  <PhoneCall />
                </IconButton>
              )}

              <IconButton
                onClick={() => {
                  onEndCall?.();
                  rejectCall?.();
                }}
                className="!bg-red-500 hover:!bg-red-600 !text-white !w-12 !h-12"
              >
                <CallEnd />
              </IconButton>
            </div>
          }

        </>
      )}

    </div>

    // </div>
  );
}