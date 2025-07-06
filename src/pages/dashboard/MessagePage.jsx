// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { Paperclip, Phone, Send } from "lucide-react";
// import userImg from "../../assets/bgImage.png";
// import nullimage from "../../assets/null image.png";
// import videoCall from "../../assets/Video-Call-Button.svg";
// import Call from "../../assets/Call Button.svg";
// import axiosInspector from "../../http/axiosMain.js";
// import EmojiPicker from "emoji-picker-react";
// // import AgoraRTC from "agora-rtc-sdk-ng";
// import VoiceCallComponent from "./VoiceCallComponent.jsx";
// import VideoCallScreen from "./VideoCallRinging.jsx";
// import VideoCallStart from "./VideoCallStart.jsx";

// // const WS_BASE_URL = "wss://loveai-api.vrajtechnosys.in/ws/chat/";
// const WS_BASE_URL = "wss://http://13.201.224.164:4444/ws/chat/";

// function MessageList({ rooms, selectedId, setSelectedId, setResiverDetail, onLoadMore, hasMore }) {
//   const listRef = useRef();

//   const handleScroll = () => {
//     const el = listRef.current;
//     if (!el) return;

//     if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10 && hasMore) {
//       onLoadMore(); // Load next page
//     }
//   };

//   return (
//     <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
//       <div className="p-4 font-semibold text-lg">Messages</div>
//       <div className="flex justify-center pb-2">
//         <input
//           type="text"
//           placeholder="Search Message"
//           className="w-full max-w-[290px] px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#F3F3F3]"
//         />
//       </div>

//       <div
//         ref={listRef}
//         onScroll={handleScroll}
//         className="flex-1 overflow-y-auto custom-scroll"
//       >
//         {rooms.map((room) => (
//           <div
//             key={room.chat_room_id}
//             onClick={() => {
//               setResiverDetail(room);
//               setSelectedId(room.chat_room_id);
//             }}
//             className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all rounded-xl m-2 ${selectedId === room.chat_room_id
//               ? "bg-[#E8F8FF]"
//               : "hover:bg-gray-50"
//               }`}
//           >
//             <img
//               src={room.user?.url || userImg}
//               className="w-10 h-10 object-cover"
//             />
//             <div className="flex-1">
//               <div className="font-medium text-sm">{room.user?.name}</div>
//               <div className="text-xs text-gray-500 truncate">
//                 {room.lastMessage}
//               </div>
//             </div>
//             <div className="text-xs text-gray-400 pl-2 min-w-[60px] text-right">
//               {new Date(room?.last_updated).toLocaleTimeString([], {
//                 hour: "2-digit",
//                 minute: "2-digit",
//               })}
//             </div>
//           </div>
//         ))}
//         {hasMore && (
//           <div className="text-center py-2 text-sm text-gray-400">
//             Loading more...
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function ChatWindow({ room, loading, onSend, resiverDetail, userId, handleVoiceCallFunc, handleVideoCallFunc }) {
//   const [input, setInput] = useState("");
//   const [showPicker, setShowPicker] = useState(false);
//   const [pendingFiles, setPendingFiles] = useState([]);
//   const containerRef = useRef(null);
//   const { token } = JSON.parse(localStorage.getItem("user_Data") || "{}");
//   const [callStatus, setCallStatus] = useState("idle");
//   const [isVideo, setIsVideo] = useState(true)

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

//   if (loading || !room) {
//     console.log(resiverDetail, "resiverDetailresiverDetailresiverDetail")
//     return (
//       <div className="flex-1 flex items-center justify-center text-gray-400">
//         Loading…
//       </div>
//     );
//   }

//   return (
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

// export default function MessagePage() {
//   const [rooms, setRooms] = useState([]);
//   const [hasMoreRooms, setHasMoreRooms] = useState(true);
//   const [roomPage, setRoomPage] = useState(0);
//   const ROOM_LIMIT = 20;

//   const [selectedId, setSelectedId] = useState(null);
//   const [resiverDetail, setResiverDetail] = useState(null);
//   const [currentRoom, setCurrentRoom] = useState({ chat: [], log: "" });
//   const [loading, setLoading] = useState(false);
//   const wsRef = useRef(null);

//   const [showVoiceCall, setShowVoiceCall] = useState(false);
//   const [showVideoCall, setShowVideoCall] = useState(false);

//   const handleVoiceCall = () => {
//     setShowVoiceCall(true);
//   };

//   const handleVideoCall = () => {
//     setShowVideoCall(true);
//   };


//   const { token, id: userId } = JSON.parse(
//     localStorage.getItem("user_Data") || "{}"
//   );

//   useEffect(() => {
//     axiosInspector
//       .get("/chatrooms")
//       .then((res) => {
//         const list = res.data.list.map((r) => ({
//           ...r,
//           lastMessage: r.last_message?.message || "",
//           chat: [],
//         }));
//         setRooms(list);
//         if (list[0]) {
//           setSelectedId(list[0].chat_room_id);
//           setResiverDetail(list[0]);
//         }
//       })
//       .catch(console.error);
//   }, []);

//   const connectSocket = useCallback(
//     (roomId) => {
//       if (wsRef.current) wsRef.current.close();
//       const url = `${WS_BASE_URL}${roomId}?authorization=${token}`;
//       const ws = new WebSocket(url);
//       wsRef.current = ws;

//       ws.onmessage = (evt) => {
//         try {
//           const data = JSON.parse(evt.data);
//           const { from, message, room_id, message_type } = data;
//           const isMe = from === String(userId);

//           setRooms((prev) =>
//             prev.map((r) =>
//               r.chat_room_id === room_id
//                 ? {
//                   ...r,
//                   chat: [{ message, isMe, message_type }, ...r.chat],
//                   lastMessage: message,
//                 }
//                 : r
//             )
//           );

//           if (room_id === selectedId) {
//             setCurrentRoom((r) => ({
//               ...r,
//               chat: [{ message, isMe, message_type }, ...r.chat],
//             }));
//           }
//         } catch (err) {
//           console.error("WebSocket message error:", err);
//         }
//       };
//     },
//     [token, userId, selectedId]
//   );

//   const sendMessage = useCallback(
//     (msg, type = "Msg", filePath = null) => {
//       if (!wsRef.current || wsRef.current.readyState !== 1) return;

//       const payload = {
//         to: resiverDetail.user.id,
//         message: msg,
//         file: type === "Image" ? msg : null,
//         file_path: filePath,
//         message_type: type,
//       };

//       wsRef.current.send(JSON.stringify(payload));

//       setCurrentRoom((r) => ({
//         ...r,
//         chat: [{ message: msg, isMe: true, message_type: type }, ...r.chat],
//       }));

//       setRooms((prev) =>
//         prev.map((r) =>
//           r.chat_room_id === selectedId
//             ? {
//               ...r,
//               chat: [
//                 { message: msg, isMe: true, message_type: type },
//                 ...r.chat,
//               ],
//               lastMessage: msg,
//             }
//             : r
//         )
//       );
//     },
//     [selectedId, resiverDetail?.user?.id]
//   );

//   const fetchRooms = useCallback(async (page = 0) => {
//     try {
//       const res = await axiosInspector.get(`/chatrooms?start=${page * ROOM_LIMIT}&limit=${ROOM_LIMIT}`);
//       const list = res.data.list.map((r) => ({
//         ...r,
//         lastMessage: r.last_message?.message || "",
//         chat: [],
//       }));

//       setRooms((prev) => [...prev, ...list]);
//       setHasMoreRooms(list.length === ROOM_LIMIT);
//       setRoomPage(page);



//       // Auto-select first chat only if none selected
//       if (page === 0 && list[0]) {
//         setSelectedId(list[0].chat_room_id);
//         setResiverDetail(list[0]);
//       }
//     } catch (error) {
//       console.error("Failed to fetch rooms:", error);
//     } finally {
//       setLoading(false)
//     }
//   }, []);


//   useEffect(() => {
//     if (!selectedId) return;
//     setLoading(true);
//     fetchRooms(0);

//     // axiosInspector
//     //   .get(`/chatrooms/${selectedId}/chats?start=0&limit=60`, {
//     //     headers: { token },
//     //   })
//     //   .then((res) => {
//     //     const history = res.data.list.map((m) => ({
//     //       message: m.message,
//     //       isMe: m.sender.id === userId,
//     //       message_type: m.message_type || "Msg",
//     //     }));
//     //     setRooms((prev) =>
//     //       prev.map((r) =>
//     //         r.chat_room_id === selectedId ? { ...r, chat: history } : r
//     //       )
//     //     );
//     //     setCurrentRoom({ chat: history, log: "" });
//     //   })
//     //   .catch(console.error)
//     //   .finally(() => setLoading(false));

//     connectSocket(selectedId);
//   }, [selectedId, token, userId, connectSocket]);

//   useEffect(() => () => wsRef.current?.close(), []);

//   return (
//     <div className="flex bg-gray-100 h-screen">
//       <MessageList
//         rooms={rooms}
//         selectedId={selectedId}
//         setSelectedId={setSelectedId}
//         setResiverDetail={setResiverDetail}
//         hasMore={hasMoreRooms}
//         onLoadMore={() => fetchRooms(roomPage + 1)}
//       />

//       <ChatWindow
//         room={currentRoom}
//         loading={loading}
//         onSend={sendMessage}
//         resiverDetail={resiverDetail}
//         userId={userId}
//         handleVideoCallFunc={handleVideoCall}
//         handleVoiceCallFunc={handleVoiceCall}
//       />
//       {/* {showVoiceCall && (
//         <VideoCallScreen />
//       )} */}
//       {/*voice call */}
//       {/* <VideoCallScreen/> */}
//       {/*voideo call */}
//       {/* {showVideoCall && (
//         <VideoCallStart onClose={() => setShowVideoCall(false)} />
//       )} */}
//       {/* <VideoCallStart /> */}
//     </div>
//   );
// }



import React, { useState, useEffect, useRef, useCallback } from "react";
import { Paperclip, Phone, Send } from "lucide-react";
import userImg from "../../assets/bgImage.png";
import nullimage from "../../assets/null image.png";
import videoCall from "../../assets/Video-Call-Button.svg";
import Call from "../../assets/Call Button.svg";
import axiosInspector from "../../http/axiosMain.js";
import EmojiPicker from "emoji-picker-react";
// import AgoraRTC from "agora-rtc-sdk-ng";
import VoiceCallComponent from "./VoiceCallComponent.jsx";
import VideoCallScreen from "./VideoCallRinging.jsx";
import VideoCallStart from "./VideoCallStart.jsx";
import axios from "axios";

const WS_BASE_URL = "wss://loveai-api.vrajtechnosys.in/ws/chat/";

function MessageList({ rooms, selectedId, setSelectedId, setResiverDetail }) {

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 font-semibold text-lg">Messages</div>
      {/* Search bar */}
      <div className="flex justify-center pb-2 ">
        <input
          type="text"
          placeholder="Search Message"
          className="w-full max-w-[290px] px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#F3F3F3]"
        />
      </div>

      <div className="flex-1 overflow-y-auto custom-scroll">
        {rooms.map((room) => (
          <div
            key={room.chat_room_id}
            onClick={() => {
              setResiverDetail(room);
              setSelectedId(room.chat_room_id);
            }}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all rounded-xl m-2 ${selectedId === room.chat_room_id
              ? "bg-[#E8F8FF]"
              : "hover:bg-gray-50"
              }`}
          >
            <img
              src={room.user?.url || userImg}
              className="w-10 h-10  object-cover  rounded-lg"
            />
            <div className="flex-1">
              <div className="font-medium text-sm">{room.user?.name}</div>
              <div className="text-xs text-gray-500 truncate">
                {room.lastMessage}
              </div>
            </div>
            {/* Right side time */}
            <div className="text-xs text-gray-400 pl-2 min-w-[60px] text-right">
              {new Date(room?.last_updated).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatWindow({
  room,
  loading,
  onSend,
  resiverDetail,
  userId,
  handleVoiceCallFunc,
  handleVideoCallFunc,
  setCurrentRoom,
  selectedId,
  setSelectedId,
  setLoading,
  setRooms,
  countMessage,
  totalCount,
  setTotalCount,
}) {
  const [input, setInput] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [pendingFiles, setPendingFiles] = useState([]);
  const containerRef = useRef(null);
  const { token } = JSON.parse(localStorage.getItem("user_Data") || "{}");
  const [callStatus, setCallStatus] = useState("idle");
  const [isVideo, setIsVideo] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const [countrow, setCountRow] = useState(0);
  const voiceRef = useRef();

  // --- New state for scroll fix ---
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const prevScrollHeightRef = useRef(0);

  const handleVoiceCall = () => {
    voiceRef.current?.startCall();
    setCallStatus("calling");
  };

  // Save scroll height before fetching more
  useEffect(() => {
    if (isFetchingMore && containerRef.current) {
      prevScrollHeightRef.current = containerRef.current.scrollHeight;
    }
  }, [isFetchingMore]);

  // Restore scroll position after new messages are prepended
  useEffect(() => {
    if (isFetchingMore && containerRef.current) {
      const container = containerRef.current;
      const newScrollHeight = container.scrollHeight;
      const prevScrollHeight = prevScrollHeightRef.current;
      container.scrollTop = newScrollHeight - prevScrollHeight;
      setIsFetchingMore(false); // Reset after scroll adjustment
    }
  }, [room?.chat, isFetchingMore]);

  // Only scroll to bottom on initial load or when sending a message
  useEffect(() => {
    if (!loading && !isFetchingMore && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [room?.chat, loading, isFetchingMore]);

  const fetchChatHistory = useCallback(() => {
    if (!selectedId) return;

    setIsFetchingMore(true); // Set flag before fetching

    let limit = 25;
    axiosInspector
      .get(
        `/chatrooms/${selectedId}/chats?start=${countrow === 0
          ? room?.chat?.length
          : countMessage < countrow
            ? countMessage
            : countrow
        }&limit=${limit}`,
        {
          headers: { token },
        }
      )
      .then((res) => {
        setTotalCount(res.data.count);
        if (res.data.list.length > 0) {
          const history = res.data.list.map((m) => ({
            message: m.message,
            isMe: m.sender.id === userId,
            message_type: m.message_type || "Msg",
            id: m.id,
          }));

          setRooms((prev) =>
            prev.map((r) =>
              r.chat_room_id === selectedId
                ? { ...r, chat: [...(r.chat || []), ...history] }
                : r
            )
          );

          const uniqueHistory = history.filter(
            (newMsg) =>
              !room.chat.some((existingMsg) => existingMsg.id === newMsg.id)
          );
          setCurrentRoom({
            chat: [...room.chat, ...uniqueHistory], // no duplicates
            log: "",
          });
          // setCountRow((prev) =>
          //   prev === 0 ? room?.chat?.length + room?.chat?.length : prev + limit
          // );
        }
      })
      .catch(console.error);
    // .finally(() => setIsFetchingMore(false)); // Now handled in scroll effect
  }, [
    selectedId,
    room,
    token,
    userId,
    setCurrentRoom,
    countrow,
    countMessage,
    setRooms,
  ]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const topThreshold = 10; // Trigger when user scrolls near top
      const bottomThreshold = 10; // Safety margin from bottom

      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;

      const isTop = scrollTop <= topThreshold;
      const isBottom =
        scrollHeight - scrollTop - clientHeight <= bottomThreshold;

      // debugger;
      if (totalCount !== room.chat?.length) {
        if (isTop && !isBottom && !loading && selectedId && !isFetchingMore) {
          // Only call when near top and NOT near bottom
          fetchChatHistory();
        }
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [loading, selectedId, fetchChatHistory, isFetchingMore]);

  useEffect(() => {
    setHasFetched(false);
  }, [selectedId]);

  // const fetchChatHistory = useCallback(() => {
  //   if (!selectedId) return;

  //   const currentRoom = room?.chat?.find((r) => r.chat_room_id === selectedId);
  //   const currentChat = currentRoom?.chat || [];

  //   setLoading(true);
  //   axiosInspector
  //     .get(`/chatrooms/${selectedId}/chats?start=${countrow === 0 ? room?.chat?.length + 1 : countrow}&limit=5`, {
  //       headers: { token },
  //     })
  //     .then((res) => {
  //       const history = res.data.list.map((m) => ({
  //         message: m.message,
  //         isMe: m.sender.id === userId,
  //         message_type: m.message_type || "Msg",
  //       }));

  //       setRooms((prev) =>
  //         prev.map((r) =>
  //           r.chat_room_id === selectedId
  //             ? { ...r, chat: [...(r.chat || []), ...history] }
  //             : r
  //         )
  //       );

  //       // setCurrentRoom({ chat: [...currentChat, ...history], log: "" });
  //       const uniqueHistory = history.filter(
  //         (newMsg) => !room.chat.some((existingMsg) => existingMsg.message === newMsg.message)
  //       );
  //       setCurrentRoom({
  //         chat: [...room.chat, ...uniqueHistory], // no duplicates
  //         log: "",
  //       });
  //       // setHasFetched(false);
  //       console.log("Start index for next fetch:", currentChat.length + history.length);
  //       setCountRow(prev => prev === 0 ? room?.chat?.length + 1 : prev + 1);
  //     })
  //     .catch(console.error)
  //     .finally(() => setLoading(false));
  // }
  //   , [selectedId, room, token, userId, setCurrentRoom]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const topThreshold = 50;    // Trigger when user scrolls near top
      const bottomThreshold = 50; // Safety margin from bottom

      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;

      const isTop = scrollTop <= topThreshold;
      const isBottom = scrollHeight - scrollTop - clientHeight <= bottomThreshold;

      // ✅ Only call when near top and NOT near bottom
      if (isTop && !isBottom && !loading && selectedId) {
        fetchChatHistory();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [loading, selectedId, fetchChatHistory]);



  useEffect(() => {
    setHasFetched(false);
  }, [selectedId]);

  const onEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
    setShowPicker(false);
  };

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

  if (loading || !room) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Loading…
      </div>
    );
  }

  //FOR LOAD MORE






  return (
    <div className="flex flex-col h-full w-full bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-6 py-4 bg-white">
        <img
          src={resiverDetail?.user?.url || userImg}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="font-semibold">{resiverDetail?.user?.name}</div>
          <div className="text-xs text-green-500">
            {resiverDetail?.user?.is_online ? "Online" : "Offline"}
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <button
            className="w-10 h-10 flex items-center justify-center rounded-md bg-[linear-gradient(95.88deg,_rgba(255,197,197,0.2)_-2.12%)]"
            onClick={() => {
              setIsVideo(true);
              handleVoiceCall();
            }}
          >
            <img src={videoCall} alt="video call" />
          </button>
          <button
            className="w-10 h-10 flex items-center justify-center rounded-md bg-[linear-gradient(108.95deg, rgba(76, 200, 42, 0.16) -1.3%)]"
            onClick={() => {
              setIsVideo(false);
              handleVoiceCall();
            }}
          >
            <img src={Call} alt="Call Button" />
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

      {/* Messages */}
      <div
        ref={containerRef}
        className="flex-1 w-full px-6 py-4 space-y-3 overflow-y-auto custom-scroll max-h-[calc(100vh-180px)]"
      >
        {[...(room.chat || [])].reverse().map((m, i) => {
          const showAvatar = i == 0 || room.chat[i - 1]?.isMe === m?.isMe;
          console.log(showAvatar, "showAvatarshowAvatarshowAvatar", room.chat[i - 1]?.isMe, m?.isMe)
          return (<div
            key={i}
            className={`flex gap-2 ${m.isMe ? "justify-end" : "justify-start"
              } items-end`}
          >
            {!showAvatar && (
              <img
                src={resiverDetail?.user?.url || userImg}
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <div
              className={`text-sm sm:text-base rounded-xl px-4 py-2 shadow ${m.isMe ? "bg-[#979797] text-white" : "bg-gray-100 text-gray-900"
                } max-w-[75%] sm:max-w-[65%] break-words whitespace-pre-wrap`}
            >
              {["Image", "Gif"].includes(m.message_type) ? (
                <div className="overflow-hidden border max-w-[250px] bg-white shadow-md border-[#00A3E0]">
                  <img
                    src={m.message || nullimage}
                    alt="chat-media"
                    className="object-contain h-[200px] w-full"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = nullimage;
                    }}
                  />
                </div>
              ) : m.message_type === "Video" ? (
                <video controls className="rounded-md max-w-full">
                  <source src={m.message} type="video/mp4" />
                </video>
              ) : m.message_type === "File" ? (
                <a
                  href={m.message}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Download File
                </a>
              ) : (
                m.message
              )}
            </div>
          </div>)
        })}
      </div>

      {/* File Preview */}
      {pendingFiles.length > 0 && (
        <div className="flex gap-2 px-4 pb-2 overflow-x-auto">
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

      {/* Input Area */}
      <div className="border-t px-4 py-3 flex items-center bg-white gap-2 relative">
        <img
          src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg"
          alt="emoji"
          className="w-6 h-6 cursor-pointer"
          onClick={() => setShowPicker(!showPicker)}
        />
        {showPicker && (
          <div className="absolute bottom-14 left-2 z-50">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}

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
          className="p-2 rounded-full"
        >
          <Paperclip />
        </button>

        <input
          type="text"
          placeholder="Type a message…"
          className="flex-1 px-4 py-2 text-sm rounded-full border border-gray-200 shadow-sm focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button
          onClick={handleSend}
          className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-md"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );

}

export default function MessagePage() {
  const [rooms, setRooms] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [resiverDetail, setResiverDetail] = useState(null);
  const [currentRoom, setCurrentRoom] = useState({ chat: [], log: "" });
  const [loading, setLoading] = useState(false);
  const wsRef = useRef(null);
  const [totalCount, setTotalCount] = useState(null);

  const [showVoiceCall, setShowVoiceCall] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [countMessage, setCountMessage] = useState(0);
  const handleVoiceCall = () => {
    setShowVoiceCall(true);
  };

  const handleVideoCall = () => {
    setShowVideoCall(true);
  };

  const { token, id: userId } = JSON.parse(
    localStorage.getItem("user_Data") || "{}"
  );

  useEffect(() => {
    axiosInspector
      .get("/chatrooms")
      .then((res) => {
        const list = res.data.list.map((r) => ({
          ...r,
          lastMessage: r.last_message?.message || "",
          chat: [],
        }));
        setRooms(list);
        if (list[0]) {
          setSelectedId(list[0].chat_room_id);
          setResiverDetail(list[0]);
        }
      })
      .catch(console.error);
  }, []);

  const connectSocket = useCallback(
    (roomId) => {
      if (wsRef.current) wsRef.current.close();
      const url = `${WS_BASE_URL}${roomId}?authorization=${token}`;
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onmessage = (evt) => {
        try {
          const data = JSON.parse(evt.data);
          const { from, message, room_id, message_type } = data;
          const isMe = from === String(userId);

          setRooms((prev) =>
            prev.map((r) =>
              r.chat_room_id === room_id
                ? {
                  ...r,
                  chat: [{ message, isMe, message_type }, ...r.chat],
                  lastMessage: message,
                }
                : r
            )
          );

          if (room_id === selectedId) {
            setCurrentRoom((r) => ({
              ...r,
              chat: [{ message, isMe, message_type }, ...r.chat],
            }));
          }
        } catch (err) {
          console.error("WebSocket message error:", err);
        }
      };
    },
    [token, userId, selectedId]
  );

  const sendMessage = useCallback(
    (msg, type = "Msg", filePath = null) => {
      if (!wsRef.current || wsRef.current.readyState !== 1) return;

      const payload = {
        to: resiverDetail.user.id,
        message: msg,
        file: type === "Image" ? msg : null,
        file_path: filePath,
        message_type: type,
      };

      wsRef.current.send(JSON.stringify(payload));

      setCurrentRoom((r) => ({
        ...r,
        chat: [{ message: msg, isMe: true, message_type: type }, ...r.chat],
      }));

      setRooms((prev) =>
        prev.map((r) =>
          r.chat_room_id === selectedId
            ? {
              ...r,
              chat: [
                { message: msg, isMe: true, message_type: type },
                ...r.chat,
              ],
              lastMessage: msg,
            }
            : r
        )
      );
    },
    [selectedId, resiverDetail?.user?.id]
  );

  useEffect(() => {
    if (!selectedId) return;
    setLoading(true);
    axiosInspector
      .get(`/chatrooms/${selectedId}/chats?start=0&limit=30`, {
        headers: { token },
      })
      .then((res) => {
        const history = res.data.list.map((m) => ({
          message: m.message,
          isMe: m.sender.id === userId,
          message_type: m.message_type || "Msg",
          id: m.id,
        }));
        setCountMessage(res.data.count);
        setRooms((prev) =>
          prev.map((r) =>
            r.chat_room_id === selectedId ? { ...r, chat: history } : r
          )
        );
        setCurrentRoom({ chat: history, log: "" });
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    connectSocket(selectedId);
  }, [selectedId, token, userId, connectSocket]);

  useEffect(() => () => wsRef.current?.close(), []);

  return (
    <div className="flex bg-gray-100 h-screen">
      <MessageList
        rooms={rooms}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        setResiverDetail={setResiverDetail}
      />
      <ChatWindow
        room={currentRoom}
        loading={loading}
        onSend={sendMessage}
        resiverDetail={resiverDetail}
        userId={userId}
        handleVideoCallFunc={handleVideoCall}
        handleVoiceCallFunc={handleVoiceCall}
        setCurrentRoom={setCurrentRoom}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        setLoading={setLoading}
        setRooms={setRooms}
        countMessage={countMessage}
        totalCount={totalCount}
        setTotalCount={setTotalCount}
      // resiverDetail
      />
      {/* {showVoiceCall && (
        <VideoCallScreen />
      )} */}
      {/*voice call */}
      {/* <VideoCallScreen/> */}
      {/*voideo call */}
      {/* {showVideoCall && (
        <VideoCallStart onClose={() => setShowVideoCall(false)} />
      )} */}
      {/* <VideoCallStart /> */}
    </div>
  );
}