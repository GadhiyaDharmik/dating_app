// import React, { useState } from "react";
// import AgoraRTC from "agora-rtc-sdk-ng";
// import axiosInspector from "../../http/axiosMain";

// const APP_ID = "cb8359241f474aca9597df671df45af1";

// const userTokens = {
//   "user1": "007eJxTYPjwuuXDqZ+3BR994I1VNd9ivvf9wgDGf8+K//k6VXhs5N+swJCcZGFsamlkYphmYm6SmJxoaWppnpJmZm6YkmZimphmeLQnLKMhkJHhLd9tZkYGCATxWRhKUotLGBgASvMimw==",
//   "user2": "007eJxTYHDpzry2qP3gs40r1kt928Et+sSnNag07+oHpmPz2NWTbZ4oMCQnWRibWhqZGKaZmJskJidamlqap6SZmRumpJmYJqYZMvWGZTQEMjKw87SzMjJAIIjPwlCSWlzCwAAAgqke/Q=="
// };

// const WS_BASE_URL = "wss://loveai-api.vrajtechnosys.in/ws/chat/";


// const BACKEND_API = "/rtc_token";

// const VoiceCallComponent = ({ userId, peerId }) => {
//   const [client] = useState(() => AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }));
//   const [localTracks, setLocalTracks] = useState([]);
//   const [joined, setJoined] = useState(false);
//   const CHANNEL_NAME = peerId;

//   const fetchRTCToken = async () => {
//     const response = await axiosInspector.post(BACKEND_API, {
//       uid: userId,
//       expireTime: 3600,
//       channelName: CHANNEL_NAME,
//     });
//     return response?.data?.token;
//   };


//   const joinCall = async () => {
//     const token = await fetchRTCToken();
//     // const token = userTokens[userId === "bfe1b897-0015-409a-a763-cc157c87313b" ? "user1" : "user2"]; // Fallback to user1 token if not found
//     console.log("Fetched token:", token);

//     if (!token) {
//       alert("Invalid user or token not found.");
//       return;
//     }

//     try {
//       await client.join(APP_ID, CHANNEL_NAME, token, userId);

//       const [micTrack, camTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
//       await client.publish([micTrack, camTrack]);

//       const localVideo = document.getElementById("local-video");
//       camTrack.play(localVideo);
//       setLocalTracks([micTrack, camTrack]);
//       setJoined(true);

//       client.on("user-published", async (user, mediaType) => {
//         await client.subscribe(user, mediaType);

//         if (mediaType === "video") {
//           const remoteContainer = document.createElement("div");
//           remoteContainer.id = user.uid;
//           remoteContainer.style.width = "100%";
//           remoteContainer.style.height = "300px";
//           document.getElementById("remote-videos").appendChild(remoteContainer);
//           user.videoTrack.play(remoteContainer);
//         }

//         if (mediaType === "audio") {
//           user.audioTrack.play();
//         }
//       });

//       client.on("user-unpublished", (user, mediaType) => {
//         if (mediaType === "video") {
//           const remoteContainer = document.getElementById(user.uid);
//           if (remoteContainer) remoteContainer.remove();
//         }
//       });

//     } catch (err) {
//       console.error("Join error:", err);
//     }
//   };

//   const leaveCall = async () => {
//     for (const track of localTracks) {
//       track.stop();
//       track.close();
//     }

//     await client.leave();
//     setLocalTracks([]);
//     setJoined(false);
//     document.getElementById("remote-videos").innerHTML = "";
//   };

//   return (
//     <div className="p-4 border rounded-md shadow-md max-w-md bg-white">
//       <h2 className="font-bold text-lg mb-4">Agora RTC Video Call - {userId}</h2>

//       <div id="local-video" style={{ width: "100%", height: "300px", backgroundColor: "#000" }} />
//       <div id="remote-videos" className="mt-4" />

//       {!joined ? (
//         <button onClick={joinCall} className="mt-4 px-4 py-2 bg-green-600 text-white rounded">
//           Join Call
//         </button>
//       ) : (
//         <button onClick={leaveCall} className="mt-4 px-4 py-2 bg-red-600 text-white rounded">
//           Leave Call
//         </button>
//       )}
//     </div>
//   );
// };

// export default VoiceCallComponent;

// VoiceCallComponent.jsx
import React, {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import axiosInspector from "../../http/axiosMain";
import VideoCallScreen from "./VideoCallRinging";
import VideoCallStart from "./VideoCallStart";

const APP_ID = "cb8359241f474aca9597df671df45af1";
const WS_BASE_URL = "wss://loveai-api.vrajtechnosys.in/ws/users/";
const UserDetail = JSON.parse(localStorage.getItem("user_Data"));

const VoiceCallComponent = forwardRef(
  ({ userId, peerId, receiverId, isVideo, token, callStatus, setCallStatus, receiverDetail }, ref) => {
    const [client] = useState(() =>
      AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })
    );
    const [localTracks, setLocalTracks] = useState([]);
    const [joined, setJoined] = useState(false);
    const [callPopup, setCallPopup] = useState(null);
    const [isCaller, setIsCaller] = useState(false);
    const [remoteUsers, setRemoteUsers] = useState([]);

    const wsRef = useRef(null);
    const isJoiningRef = useRef(false);
    const channelName = peerId;

    useEffect(() => {
      const ws = new WebSocket(`${WS_BASE_URL}${userId}?authorization=${token}`);
      wsRef.current = ws;

      ws.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case "call_invitation":
            if (data.caller_id !== userId) {
              setCallPopup(data);
              setCallStatus("calling");
            }
            break;

          case "call_accepted":
            if (data.recepient_id === userId) {
              console.log("Receiver (you) accepted.");
            } else if (data.caller_id === receiverId) {
              console.log("Receiver accepted. Caller joining call...");
              setCallStatus("call_accepted");
              await joinCall(data.channel_name);
            }
            break;

          case "call_rejected":
          case "call_ended":
            setCallStatus("idle");
            await leaveCall();
            break;

          default:
            break;
        }
      };

      return () => {
        ws.close();
      };
    }, [userId]);

    const fetchRTCToken = async (channel) => {
      const response = await axiosInspector.post("/rtc_token", {
        uid: userId,
        expireTime: 3600,
        channelName: channel,
      });
      return response?.data?.token;
    };

    const sendSocketMessage = (payload) => {
      if (wsRef.current?.readyState === 1) {
        wsRef.current.send(JSON.stringify(payload));
      }
    };

    const startCall = () => {
      sendSocketMessage({
        type: "call_invitation",
        caller_id: userId,
        caller_name: UserDetail?.name || "Unknown",
        recepient_id: receiverId,
        call_type: isVideo ? "video" : "voice",
        channel_name: channelName,
      });
      setIsCaller(true);
      setCallStatus("calling");
    };

    const acceptCall = async () => {
      setCallPopup(null);
      sendSocketMessage({
        type: "call_accepted",
        caller_id: userId,
        caller_name: UserDetail?.name || "Unknown",
        recepient_id: receiverId,
        call_type: callPopup?.call_type,
        channel_name: callPopup?.channel_name,
      });
      setCallStatus("call_accepted");
      await joinCall(callPopup?.channel_name);
    };

    const rejectCall = () => {
      sendSocketMessage({
        type: "call_rejected",
        caller_id: userId,
        caller_name: UserDetail?.name || "Unknown",
        recepient_id: receiverId,
        call_type: callPopup?.call_type,
        channel_name: callPopup?.channel_name,
      });
      setCallPopup(null);
      setCallStatus("idle");
      leaveCall();
    };

    const joinCall = async (channel) => {
      if (joined || isJoiningRef.current) return;
      isJoiningRef.current = true;

      try {
        const rtcToken = await fetchRTCToken(channel);
        if (!rtcToken) {
          alert("Token generation failed.");
          return;
        }

        await client.join(APP_ID, channel, rtcToken, userId);

        let micTrack, camTrack;
        if (isVideo) {
          [micTrack, camTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
          await client.publish([micTrack, camTrack]);
          const localVideo = document.getElementById("local-video");
          if (localVideo) camTrack.play(localVideo);
          setLocalTracks([micTrack, camTrack]);
        } else {
          micTrack = await AgoraRTC.createMicrophoneAudioTrack();
          await client.publish([micTrack]);
          setLocalTracks([micTrack]);
        }

        setJoined(true);
        setCallStatus("ongoing");

        client.on("user-published", async (user, mediaType) => {
          await client.subscribe(user, mediaType);
          setRemoteUsers((prev) => {
            const exists = prev.find((u) => u.uid === user.uid);
            return exists ? prev : [...prev, user];
          });

          if (mediaType === "video") {
            const remoteContainer = document.createElement("div");
            remoteContainer.id = user.uid;
            remoteContainer.style.width = "100%";
            remoteContainer.style.height = "300px";
            document.getElementById("remote-videos")?.appendChild(remoteContainer);
            user.videoTrack.play(remoteContainer);
          }

          if (mediaType === "audio" && user.audioTrack) {
            user.audioTrack.play().catch((err) => {
              console.warn("Audio play failed:", err);
            });
          }
        });

        client.on("user-unpublished", (user, mediaType) => {
          if (mediaType === "video") {
            const remoteContainer = document.getElementById(user.uid);
            if (remoteContainer) remoteContainer.remove();
          }
        });

        client.on("user-left", (user) => {
          setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
        });
      } catch (err) {
        console.error("Join error:", err);
      } finally {
        isJoiningRef.current = false;
      }
    };

    const leaveCall = async () => {
      for (const track of localTracks) {
        track.stop();
        track.close();
      }

      client.removeAllListeners();
      await client.leave();

      const remoteVideos = document.getElementById("remote-videos");
      if (remoteVideos) remoteVideos.innerHTML = "";

      setCallStatus("idle");
      setLocalTracks([]);
      setJoined(false);
      setCallPopup(null);
      setIsCaller(false);
    };

    useImperativeHandle(ref, () => ({
      startCall,
      leaveCall,
      mute: () => localTracks[0]?.setEnabled(false),
      unmute: () => localTracks[0]?.setEnabled(true),
    }));

    return (
      <div>
        {/* {isVideo && (callPopup || callStatus === "call_accepted" || callStatus === "ongoing") && (
          <div className="fixed top-0 left-0 py-2 w-full h-full bg-[#000000b8] flex items-center justify-center z-50">
            <div className="bg-transparent p-6 rounded-2xl w-full h-full m-8 flex flex-col items-center justify-center">
              <VideoCallStart
                onEndCall={() => {
                  sendSocketMessage({
                    type: "call_ended",
                    caller_id: userId,
                    recepient_id: receiverId,
                    call_type: isVideo ? "video" : "voice",
                    channel_name: channelName,
                  });
                  leaveCall();
                }}
                onToggleMute={(muted) => {
                  localTracks[0]?.setEnabled(!muted);
                }}
                type={callPopup?.type}
                isCaller={isCaller}
                receiverDetail={receiverDetail}
                callStatus={callStatus}
                acceptCall={acceptCall}
                rejectCall={rejectCall}
                isVideo={isVideo}
                localStream={localTracks.length > 0 ? localTracks : null}
                remoteStream={
                  remoteUsers.length > 0 && remoteUsers[0]?.videoTrack
                    ? [remoteUsers[0].videoTrack]
                    : null
                }
              />
            </div>
          </div>
        )} */}

        {((callPopup || callStatus !== "idle")) && (
          <div className="fixed top-0 left-0 py-2 w-full h-full bg-[#000000b8] bg-opacity-50 flex items-end sm:items-center justify-center z-50">
            <div
              className="bg-transparent p-6 rounded-2xl shadow-xl w-full h-full m-8 flex flex-col items-center justify-center"
              style={{ animation: "slideUp 0.4s ease-out" }}
            >
              <VideoCallScreen
                onEndCall={() => {
                  sendSocketMessage({
                    type: "call_ended",
                    caller_id: userId,
                    recepient_id: receiverId,
                    call_type: isVideo ? "video" : "voice",
                    channel_name: channelName,
                  });
                  leaveCall();
                }}
                userId={userId}
                type={callPopup?.type}
                isCaller={isCaller}
                receiverDetail={receiverDetail}
                callStatus={callStatus}
                acceptCall={acceptCall}
                rejectCall={rejectCall}
                isVideo={isVideo}
                onToggleMute={(muted) => {
                  localTracks[0]?.setEnabled(!muted);
                }}
              />
            </div>
            <style>
              {`
                @keyframes slideUp {
                  0% { transform: translateY(100%); opacity: 0; }
                  100% { transform: translateY(0); opacity: 1; }
                }
              `}
            </style>
          </div>
        )}
      </div>
    );
  }
);

export default VoiceCallComponent;



