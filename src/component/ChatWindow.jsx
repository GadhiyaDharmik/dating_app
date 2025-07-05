// import { useCallback, useEffect, useRef, useState } from "react";
// import VoiceCallComponent from "../pages/dashboard/VoiceCallComponent";
// import { Paperclip, Send } from "lucide-react";
// import userImg from "../assets/bgImage.png";
// import nullimage from "../assets/null image.png";
// import videoCall from "../assets/Video-Call-Button.svg";
// import Call from "../assets/Call Button.svg";
// import axiosInspector from "../http/axiosMain.js";
// import EmojiPicker from "emoji-picker-react";

// const ChatWindow = ({ room, loading, onSend, resiverDetail, userId, handleVoiceCallFunc, handleVideoCallFunc
//   , setCurrentRoom, selectedId, setSelectedId, setLoading, setRooms }) => {
//     const [input, setInput] = useState("");
//   const [showPicker, setShowPicker] = useState(false);
//   const [pendingFiles, setPendingFiles] = useState([]);
//   const containerRef = useRef(null);
//   const { token } = JSON.parse(localStorage.getItem("user_Data") || "{}");
//   const [callStatus, setCallStatus] = useState("idle");
//   const [isVideo, setIsVideo] = useState(true);
//   const [hasFetched, setHasFetched] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [countrow, setCountRow] = useState(0);
//   const voiceRef = useRef();

//   const handleVoiceCall = () => {
//     voiceRef.current?.startCall();
//     setCallStatus("calling");

//   };

//   useEffect(() => {
//     if (!loading && containerRef.current) {
//       containerRef.current.scrollTop = containerRef.current.scrollHeight;
//     }
//   }, [room?.chat, loading]);

//   const fetchChatHistory = useCallback(() => {
//   if (!selectedId || !hasMore || !containerRef.current) return;

//   const container = containerRef.current;
//   const previousScrollHeight = container.scrollHeight;

//   setLoading(true);
//   axiosInspector
//     .get(`/chatrooms/${selectedId}/chats?start=${countrow}&limit=5`, {
//       headers: { token },
//     })
//     .then((res) => {
//       const history = res.data.list.map((m) => ({
//         message: m.message,
//         isMe: m.sender.id === userId,
//         message_type: m.message_type || "Msg",
//       }));

//       if (history.length < 5) setHasMore(false);

//       // Insert new (older) messages at the end of array since we reverse() before rendering
//       setRooms((prev) =>
//         prev.map((r) =>
//           r.chat_room_id === selectedId
//             ? { ...r, chat: [...(r.chat || []), ...history] }
//             : r
//         )
//       );

//       const uniqueHistory = history.filter(
//         (newMsg) => !room.chat.some((existingMsg) => existingMsg.message === newMsg.message)
//       );

//       setCurrentRoom({
//         chat: [...room.chat, ...uniqueHistory],
//         log: "",
//       });

//       setCountRow((prev) => (prev === 0 ? room?.chat?.length + 1 : prev + 5));

//       // Defer scroll adjustment until messages are rendered
//       setTimeout(() => {
//         const newScrollHeight = container.scrollHeight;
//         container.scrollTop = newScrollHeight - previousScrollHeight;
//       }, 0);
//     })
//     .catch(console.error)
//     .finally(() => setLoading(false));
// }, [selectedId, room, token, userId, setCurrentRoom]);

//  useEffect(() => {
//   const container = containerRef.current;
//   if (!container) return;

//   const handleScroll = () => {
//     if (container.scrollTop <= 50 && !loading && hasMore) {
//       fetchChatHistory();
//     }
//   };

//   container.addEventListener("scroll", handleScroll);
//   return () => container.removeEventListener("scroll", handleScroll);
// }, [fetchChatHistory, loading, hasMore]);

//   useEffect(() => {
//     setHasFetched(false);
//   }, [selectedId]);

//   const onEmojiClick = (emojiData) => {
//     setInput((prev) => prev + emojiData.emoji);
//     setShowPicker(false);
//   };

//   let agoraClient = null;
//   let localAudioTrack = null;

//   // const joinVoiceCall = async (appId, channelName, token, uid) => {
//   //   try {
//   //     agoraClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

//   //     await agoraClient.join(appId, channelName, token, uid);

//   //     localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();

//   //     await agoraClient.publish([localAudioTrack]);

//   //     console.log("Joined voice call successfully.");
//   //   } catch (err) {
//   //     console.error("Failed to join voice call:", err?.message || err);
//   //     console.error("Full error object:", err); // Add this line
//   //   }
//   // };

//   // const leaveVoiceCall = async () => {
//   //   if (localAudioTrack) {
//   //     localAudioTrack.close();
//   //     localAudioTrack = null;
//   //   }

//   //   if (agoraClient) {
//   //     await agoraClient.leave();
//   //     agoraClient = null;
//   //     console.log("Left voice call.");
//   //   }
//   // };

//   // const handleVideoCall = async () => {
//   //   const uid = userId || Math.floor(Math.random() * 10000);
//   //   const channelName = `room-${room.chat_room_id}`;

//   //   try {
//   //     const res = await fetch(
//   //       "https://c9e7-103-88-56-118.ngrok-free.app/rtc_token",
//   //       {
//   //         method: "POST",
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //         },
//   //         body: JSON.stringify({
//   //           channelName,
//   //           uid,
//   //           expireTime: 3600,
//   //         }),
//   //       }
//   //     );

//   //     const data = await res.json();
//   //     console.log("Agora Token Info:", data);

//   //     // Redirect to call page or open modal with Agora
//   //     // Or use a state toggle to show VideoCall component
//   //     alert(`Token: ${data.token}\nChannel: ${data.channelName}`);
//   //   } catch (error) {
//   //     console.error("Failed to get Agora token", error);
//   //   }
//   // };
//   // const handleVoiceCall = async () => {
//   //   const uid = resiverDetail.user.id || Math.floor(Math.random() * 10000);
//   //   const channelName = `voice-${room.chat_room_id}`;

//   //   try {
//   //     const response = await axiosInspector.post(
//   //       "https://c9e7-103-88-56-118.ngrok-free.app/rtc_token",
//   //       {
//   //         channelName,
//   //         uid,
//   //         expireTime: 3600,
//   //       }
//   //     );

//   //     const { rtcToken } = response.data;

//   //     await joinVoiceCall(
//   //       "cb8359241f474aca9597df671df45af1",
//   //       channelName,
//   //       rtcToken,
//   //       uid
//   //     );
//   //     alert("Voice call started");
//   //   } catch (error) {
//   //     console.error("Voice call failed:", error);
//   //   }
//   // };

//   const handleSend = async () => {
//     if (input.trim()) {
//       onSend(input, "Msg");
//       setInput("");
//     }

//     if (pendingFiles.length > 0) {
//       const formData = new FormData();
//       pendingFiles.forEach((file) => formData.append("files", file));

//       try {
//         const res = await axiosInspector.post("/chats/media", formData, {
//           headers: {
//             token: token,
//             "Content-Type": "multipart/form-data",
//           },
//         });

//         const uploaded = res.data;
//         for (const file of uploaded) {
//           const ext = file.path.split(".").pop().toLowerCase();
//           let type = "File";

//           if (["jpg", "jpeg", "png", "webp"].includes(ext)) type = "Image";
//           else if (["gif"].includes(ext)) type = "Gif";
//           else if (["mp4", "mov", "avi", "webm"].includes(ext)) type = "Video";

//           if (type === "Image") {
//             onSend(file.url, type, file.path);
//           } else {
//             onSend(file.url, type);
//           }
//         }

//         setPendingFiles([]);
//       } catch (err) {
//         console.error("Media upload failed:", err);
//       }
//     }
//   };

//  return (
//     <div className="flex-1 flex flex-col bg-white">
//       {/* Header */}
//       <div className="flex items-center gap-3 border-b px-6 py-4 bg-white">
//         <img
//           src={resiverDetail?.user?.url || userImg}
//           className="w-10 h-10 rounded-full object-cover"
//         />
//         <div className="flex-1">
//           <div className="font-semibold">{resiverDetail?.user?.name}</div>
//           <div className="text-xs text-green-500">
//             {resiverDetail?.user?.is_online ? "Online" : "Offline"}
//           </div>
//         </div>
//         <div className="flex gap-2 items-center">
//           <button className="w-10 h-15 flex items-center justify-center rounded-md bg-[linear-gradient(95.88deg,_rgba(255,197,197,0.2)_-2.12%]"
//             onClick={() => {
//               handleVoiceCall()
//               setIsVideo(true)
//             }}
//           >
//             <img src={videoCall} alt="video call" />
//           </button>
//         </div>

//         <div className="flex gap-2 items-center">
//           <button
//             className="w-10 h-15 flex items-center justify-center rounded-md bg-[linear-gradient(108.95deg, rgba(76, 200, 42, 0.16) -1.3%,]"
//             onClick={() => {
//               setIsVideo(false)
//               handleVoiceCall()
//             }}
//           >

//             <img src={Call} alt="Call Button" />
//           </button>

//           <VoiceCallComponent
//             ref={voiceRef}
//             peerId={resiverDetail?.chat_room_id}
//             userId={userId}
//             receiverId={resiverDetail?.user?.id}
//             receiverDetail={resiverDetail}
//             isVideo={isVideo}
//             token={token}
//             callStatus={callStatus} setCallStatus={setCallStatus}
//           />

//           {/* <VoiceCallComponent
//             channelName={`voice-${resiverDetail?.chat_room_id}`}
//             receiverId={resiverDetail?.user?.id}
//             userId={userId}
//           /> */}
//         </div>
//       </div>

//       {/* Messages */}
//       <div
//         ref={containerRef}
//         className="flex-1 px-6 py-4 space-y-3 overflow-y-auto custom-scroll max-h-[calc(100vh-180px)]"
//       >
// {loading && (
//           <div className="text-center text-sm text-gray-400 py-2">
//             Loading older messages…
//           </div>
//         )}
//         {[...(room.chat || [])].reverse().map((m, i) => (
//           <div
//             key={i}
//             className={`flex gap-2 ${m.isMe ? "justify-end" : "justify-start"
//               } items-end`}
//           >
//             {!m.isMe && (
//               <img
//                 src={resiverDetail?.user?.url || userImg}
//                 className="w-8 h-8 rounded-full object-cover"
//               />
//             )}
//             <div
//               className={`rounded-sm text-xl p-1 max-w-[70%] shadow ${m.isMe ? "bg-[#979797] text-white" : "bg-gray-100 text-gray-900"
//                 }`}
//             >
//               {["Image", "Gif"].includes(m.message_type) ? (
//                 <div className="overflow-hidden border max-w-[250px] bg-white shadow-md border-[#00A3E0]">
//                   <img
//                     src={m.message || nullimage}
//                     alt="chat-media"
//                     className="object-contain h-[200px] w-full"
//                     onError={(e) => {
//                       e.target.onerror = null; // prevent infinite loop
//                       e.target.src = nullimage;
//                     }}
//                   />
//                 </div>
//               ) : m.message_type === "Video" ? (
//                 <video controls className="rounded-md max-w-full">
//                   <source src={m.message} type="video/mp4" />
//                 </video>
//               ) : m.message_type === "File" ? (
//                 <a
//                   href={m.message}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="underline"
//                 >
//                   Download File
//                 </a>
//               ) : (
//                 m.message
//               )}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Preview */}
//       {pendingFiles.length > 0 && (
//         <div className="flex gap-2 px-4 pb-2 overflow-x-auto">
//           {pendingFiles.map((file, idx) => {
//             const url = URL.createObjectURL(file);
//             return file.type.startsWith("image/") ? (
//               <img
//                 key={idx}
//                 src={url}
//                 className="w-16 h-16 rounded object-cover"
//                 alt="preview"
//               />
//             ) : file.type.startsWith("video/") ? (
//               <video key={idx} src={url} className="w-16 h-16 rounded" muted />
//             ) : (
//               <div
//                 key={idx}
//                 className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-sm"
//               >
//                 📄
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Input */}
//       <div className="border-t px-4 py-3 flex items-center bg-white gap-2 relative">
//         <img
//           src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg"
//           alt="emoji"
//           className="w-6 h-6 cursor-pointer"
//           onClick={() => setShowPicker(!showPicker)}
//         />
//         {showPicker && (
//           <div className="absolute bottom-14 left-2 z-50">
//             <EmojiPicker onEmojiClick={onEmojiClick} />
//           </div>
//         )}

//         <input
//           type="file"
//           id="media-upload"
//           className="hidden"
//           multiple
//           onChange={(e) => {
//             const files = Array.from(e.target.files || []);
//             setPendingFiles((prev) => [...prev, ...files]);
//           }}
//         />
//         <button
//           onClick={() => document.getElementById("media-upload").click()}
//           className="p-2 rounded-full"
//         >
//           <Paperclip />
//         </button>

//         <input
//           type="text"
//           placeholder="Type a message…"
//           className="flex-1 px-4 py-2 text-sm rounded-full border border-gray-200 shadow-sm focus:outline-none"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === "Enter" && !e.shiftKey) {
//               e.preventDefault(); // prevent newline
//               handleSend();
//             }
//           }}
//         />
//         <button
//           onClick={handleSend}
//           className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-md"
//         >
//           <Send size={18} />
//         </button>
//       </div>
//     </div>
//   );
// }

// export default ChatWindow



import { useCallback, useEffect, useRef, useState } from "react";
import VoiceCallComponent from "../pages/dashboard/VoiceCallComponent";
import { Paperclip, Send } from "lucide-react";
import userImg from "../assets/bgImage.png";
import videoCall from "../assets/Video-Call-Button.svg";
import Call from "../assets/Call Button.svg";
import axiosInspector from "../http/axiosMain.js";
import EmojiPicker from "emoji-picker-react";

const ChatWindow = ({
  room,
  onSend,
  resiverDetail,
  userId,
  handleVoiceCallFunc,
  handleVideoCallFunc,
  setCurrentRoom,
  selectedId,
  setRooms,
}) => {
  const [input, setInput] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [pendingFiles, setPendingFiles] = useState([]);
  const containerRef = useRef(null);
  const { token } = JSON.parse(localStorage.getItem("user_Data") || "{}");
  const [callStatus, setCallStatus] = useState("idle");
  const [isVideo, setIsVideo] = useState(true);
  const voiceRef = useRef();
  const [countRow, setCountRow] = useState(10); // initial fetch was 10
const [isLoadingMore, setIsLoadingMore] = useState(false);
const [hasMore, setHasMore] = useState(true);

  const handleVoiceCall = () => {
    voiceRef.current?.startCall();
    setCallStatus("calling");
  }
  // Scroll handler
  useEffect(() => {
  const container = containerRef.current;
  if (!container) return;

  const handleScroll = () => {
    if (container.scrollTop <= 10 && hasMore && !isLoadingMore) {
      fetchChatHistory(); // 👈 load more when at top
    }
  };

  container.addEventListener("scroll", handleScroll);
  return () => container.removeEventListener("scroll", handleScroll);
}, [hasMore, isLoadingMore, room.chat.length]);


 const fetchChatHistory = useCallback(() => {
  if (!selectedId || !containerRef.current) return;

  const container = containerRef.current;
  const prevScrollHeight = container.scrollHeight;

  setIsLoadingMore(true);

  axiosInspector
    .get(`/chatrooms/${selectedId}/chats?start=${countRow}&limit=5`, {
      headers: { token },
    })
    .then((res) => {
      const history = res.data.list.map((m) => ({
        message: `${m.message}`,
        isMe: m.sender.id === userId,
        message_type: m.message_type || "Msg",
      }));

      if (history.length < 5) {
        setHasMore(false);
      }

      // Update rooms and current room state
      setRooms((prev) =>
        prev.map((r) =>
          r.chat_room_id === selectedId
            ? { ...r, chat: [...(r.chat || []), ...history] }
            : r
        )
      );

      setCurrentRoom((prev) => ({
        ...prev,
        chat: [...prev.chat, ...history], // Add to end (reverse later)
      }));

      setCountRow((prev) => prev + 5); // Update start offset

      setTimeout(() => {
        const newScrollHeight = container.scrollHeight;
        container.scrollTop = newScrollHeight - prevScrollHeight;
        setIsLoadingMore(false);
      }, 50);
    })
    .catch((err) => {
      console.error("Error fetching older messages:", err);
      setIsLoadingMore(false);
    });
}, [selectedId, countRow, token, userId, setCurrentRoom]);


  const onEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
    setShowPicker(false);
  };

  let agoraClient = null;
  let localAudioTrack = null;

  // const joinVoiceCall = async (appId, channelName, token, uid) => {
  //   try {
  //     agoraClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

  //     await agoraClient.join(appId, channelName, token, uid);

  //     localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();

  //     await agoraClient.publish([localAudioTrack]);

  //     console.log("Joined voice call successfully.");
  //   } catch (err) {
  //     console.error("Failed to join voice call:", err?.message || err);
  //     console.error("Full error object:", err); // Add this line
  //   }
  // };

  // const leaveVoiceCall = async () => {
  //   if (localAudioTrack) {
  //     localAudioTrack.close();
  //     localAudioTrack = null;
  //   }

  //   if (agoraClient) {
  //     await agoraClient.leave();
  //     agoraClient = null;
  //     console.log("Left voice call.");
  //   }
  // };

  // const handleVideoCall = async () => {
  //   const uid = userId || Math.floor(Math.random() * 10000);
  //   const channelName = `room-${room.chat_room_id}`;

  //   try {
  //     const res = await fetch(
  //       "https://c9e7-103-88-56-118.ngrok-free.app/rtc_token",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           channelName,
  //           uid,
  //           expireTime: 3600,
  //         }),
  //       }
  //     );

  //     const data = await res.json();
  //     console.log("Agora Token Info:", data);

  //     // Redirect to call page or open modal with Agora
  //     // Or use a state toggle to show VideoCall component
  //     alert(`Token: ${data.token}\nChannel: ${data.channelName}`);
  //   } catch (error) {
  //     console.error("Failed to get Agora token", error);
  //   }
  // };
  // const handleVoiceCall = async () => {
  //   const uid = resiverDetail.user.id || Math.floor(Math.random() * 10000);
  //   const channelName = `voice-${room.chat_room_id}`;

  //   try {
  //     const response = await axiosInspector.post(
  //       "https://c9e7-103-88-56-118.ngrok-free.app/rtc_token",
  //       {
  //         channelName,
  //         uid,
  //         expireTime: 3600,
  //       }
  //     );

  //     const { rtcToken } = response.data;

  //     await joinVoiceCall(
  //       "cb8359241f474aca9597df671df45af1",
  //       channelName,
  //       rtcToken,
  //       uid
  //     );
  //     alert("Voice call started");
  //   } catch (error) {
  //     console.error("Voice call failed:", error);
  //   }
  // };

  const handleSend = async () => {
    if (input.trim()) {
      onSend(input, "Msg");
      setInput("");
    }

    if (pendingFiles.length > 0) {
      const formData = new FormData();
      pendingFiles.forEach((file) => formData.append("files", file));

      try {
        const res = await axiosInspector.post("/chats/media", formData, {
          headers: {
            token: token,
            "Content-Type": "multipart/form-data",
          },
        });

        const uploaded = res.data;
        for (const file of uploaded) {
          const ext = file.path.split(".").pop().toLowerCase();
          let type = "File";

          if (["jpg", "jpeg", "png", "webp"].includes(ext)) type = "Image";
          else if (["gif"].includes(ext)) type = "Gif";
          else if (["mp4", "mov", "avi", "webm"].includes(ext)) type = "Video";

          if (type === "Image") {
            onSend(file.url, type, file.path);
          } else {
            onSend(file.url, type);
          }
        }

        setPendingFiles([]);
      } catch (err) {
        console.error("Media upload failed:", err);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white rounded-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src={resiverDetail?.user?.url || userImg}
            alt="Receiver"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="font-semibold text-gray-900 text-sm sm:text-base">
              {resiverDetail?.user?.name || "Unknown User"}
            </div>
            <div
              className={`text-xs ${
                resiverDetail?.user?.is_online
                  ? "text-green-500"
                  : "text-gray-400"
              }`}
            >
              {resiverDetail?.user?.is_online ? "Online" : "Offline"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center bg-blue-100 hover:bg-blue-200 transition"
            onClick={() => {
              handleVoiceCall();
              setIsVideo(true);
            }}
          >
            <img src={videoCall} alt="Video Call" className="w-5 h-5" />
          </button>

          <button
            className="w-9 h-9 rounded-full flex items-center justify-center bg-green-100 hover:bg-green-200 transition"
            onClick={() => {
              handleVoiceCall();
              setIsVideo(false);
            }}
          >
            <img src={Call} alt="Voice Call" className="w-5 h-5" />
          </button>

          <VoiceCallComponent
            ref={voiceRef}
            peerId={resiverDetail?.chat_room_id}
            userId={userId}
            receiverId={resiverDetail?.user?.id}
            receiverDetail={resiverDetail}
            isVideo={isVideo}
            token={token}
            callStatus={callStatus}
            setCallStatus={setCallStatus}
          />
        </div>
      </div>

      {/* Chat Body */}
     <div
  ref={containerRef}
  className="flex-1 overflow-y-auto bg-gray-50 px-4 py-3 space-y-4 custom-scroll"
>
  {isLoadingMore && (
    <div className="text-center text-sm text-gray-500 py-2">
      Loading older messages...
    </div>
  )}

  {[...room.chat].reverse().map((msg, index) => (
    <div
      key={index}
      className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}
    >
      {!msg.isMe && (
        <img
          src={resiverDetail?.user?.url || userImg}
          alt="Receiver"
          className="w-8 h-8 rounded-full mr-2 self-end"
        />
      )}

      <div
        className={`max-w-xs sm:max-w-md px-4 py-2 rounded-2xl shadow-md text-sm ${
          msg.isMe
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-white text-gray-900 rounded-bl-none"
        }`}
      >
        {["Image", "Gif"].includes(msg.message_type) ? (
          <div className="overflow-hidden border max-w-[250px] bg-white shadow-md border-[#00A3E0]">
            <img
              src={msg.message || nullimage}
              alt="chat-media"
              className="object-contain h-[200px] w-full"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = nullimage;
              }}
            />
          </div>
        ) : msg.message_type === "Video" ? (
          <video controls className="rounded-md max-w-full">
            <source src={msg.message} type="video/mp4" />
          </video>
        ) : msg.message_type === "File" ? (
          <a
            href={msg.message}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Download File
          </a>
        ) : (
          <p>{msg.message}</p>
        )}
      </div>

      {msg.isMe && (
        <img
          src={userImg}
          alt="Sender"
          className="w-8 h-8 rounded-full ml-2 self-end"
        />
      )}
    </div>
  ))}
</div>


      {/* Preview */}
      {pendingFiles.length > 0 && (
        <div className="flex gap-2 px-4 py-2 overflow-x-auto bg-white">
          {pendingFiles.map((file, idx) => {
            const url = URL.createObjectURL(file);
            return file.type.startsWith("image/") ? (
              <img
                key={idx}
                src={url}
                className="w-16 h-16 rounded object-cover"
                alt="preview"
              />
            ) : file.type.startsWith("video/") ? (
              <video key={idx} src={url} className="w-16 h-16 rounded" muted />
            ) : (
              <div
                key={idx}
                className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-sm"
              >
                📄
              </div>
            );
          })}
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 bg-white">
        <div className="flex items-center gap-2 relative">
          <div className="relative">
            <img
              src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg"
              alt="emoji"
              className="w-6 h-6 cursor-pointer"
              onClick={() => setShowPicker(!showPicker)}
            />
            {showPicker && (
              <div className="absolute bottom-12 left-0 z-50 shadow-md">
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            )}
          </div>

          <input
            type="file"
            id="media-upload"
            className="hidden"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              setPendingFiles((prev) => [...prev, ...files]);
            }}
          />
          <button
            onClick={() => document.getElementById("media-upload").click()}
            className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-blue-500"
          >
            <Paperclip size={20} />
          </button>

          <div className="flex-1">
            <input
              type="text"
              placeholder="Type a message…"
              className="w-full px-4 py-2 text-sm rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
          </div>

          <button
            onClick={handleSend}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow transition"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
