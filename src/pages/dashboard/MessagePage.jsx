// import { useState, useEffect, useRef, useCallback } from "react";
// import axiosInspector from "../../http/axiosMain.js";
// import MessageList from "../../component/MessageList.jsx";
// import ChatWindow from "../../component/ChatWindow.jsx";
// // import AgoraRTC from "agora-rtc-sdk-ng";
// const WS_BASE_URL = "wss://loveai-api.vrajtechnosys.in/ws/chat/";

// export default function MessagePage() {
//   const [rooms, setRooms] = useState([]);
//   const [selectedId, setSelectedId] = useState(null);
//   const [resiverDetail, setResiverDetail] = useState(null);
//   const [currentRoom, setCurrentRoom] = useState({ chat: [], log: "" });
//   const [loading, setLoading] = useState(true);
//   const wsRef = useRef(null);
//   const [countRow, setCountRow] = useState(0)
//   const [limit, setLimit] = useState(10)
//   const [hasMore, setHasMore] = useState(true);

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
//   const loadRooms = async () => {
//     try {
//       setLoading(true);
//       const res = await axiosInspector.get("/chatrooms");
//       const list = res.data.list.map((r) => ({
//         ...r,
//         lastMessage: r.last_message?.message || "",
//         chat: [],
//       }));

//       setRooms(list);

//       // If no room selected yet, pick the first one
//       const defaultRoom = selectedId || list[0]?.chat_room_id;
//       if (defaultRoom) {
//         setSelectedId(defaultRoom);
//         const selectedRoom = list.find((r) => r.chat_room_id === defaultRoom);
//         setResiverDetail(selectedRoom);
//       }

//     } catch (err) {
//       console.error("Error loading chatrooms:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   loadRooms();
// }, []);


// useEffect(() => {
//   if (!selectedId) return;

//   // Reset current room before fetch
//   setCurrentRoom({ chat: [], log: "" });
//   setHasMore(true);
//   setCountRow(0);

//   // Set loading state and reconnect socket
//   setLoading(true);
//   connectSocket(selectedId);
// }, [selectedId]);


//  const connectSocket = useCallback(
//   (roomId) => {
//     if (!roomId || !token) return;

//     if (wsRef.current) wsRef.current.close();

//     const ws = new WebSocket(`${WS_BASE_URL}${roomId}?authorization=${token}`);
//     wsRef.current = ws;

//     ws.onmessage = (evt) => {
//       try {
//         const data = JSON.parse(evt.data);
//         const { from, message, room_id, message_type } = data;
//         const isMe = from === String(userId);

//         // Only update if it's the expected room
//         if (room_id !== roomId) return;

//         setRooms((prev) =>
//           prev.map((r) =>
//             r.chat_room_id === room_id
//               ? {
//                   ...r,
//                   chat: [{ message, isMe, message_type }, ...r.chat],
//                   lastMessage: message,
//                 }
//               : r
//           )
//         );

//         setCurrentRoom((prev) => ({
//           ...prev,
//           chat: [{ message, isMe, message_type }, ...prev.chat],
//         }));
//       } catch (err) {
//         console.error("WebSocket message error:", err);
//       }
//     };
//   },
//   [token, userId]
// );


// useEffect(() => {
//   if (selectedId && hasMore) {
//     fetchChatHistory();
//   }
// }, [countRow, selectedId]);



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

//    const fetchChatHistory = useCallback(() => {
//   if (!selectedId || !hasMore || loading) return;

//   setLoading(true);

//   axiosInspector
//     .get(`/chatrooms/${selectedId}/chats?start=0&limit=5`, {
//       headers: { token },
//     })
//     .then((res) => {
//       const history = res.data.list.map((m) => ({
//         message: `${m.message}`,
//         isMe: m.sender.id === userId,
//         message_type: m.message_type || "Msg",
//       }));

//       if (history.length < 5) {
//         setHasMore(false);
//       }

//       // Update rooms and current room state
//       setRooms((prev) =>
//         prev.map((r) =>
//           r.chat_room_id === selectedId
//             ? { ...r, chat: [...(r.chat || []), ...history] }
//             : r
//         )
//       );


//       setCurrentRoom((prev) => ({
//         ...prev,
//         chat: [...prev.chat, ...history], // Add to end (reverse later)
//       }));

//       setLoading(false);

//     })
//     .catch((err) => {
//       console.error("Error fetching older messages:", err);
//     }).finally(() => setLoading(false));

// }, [selectedId, limit, countRow, token, userId, setCurrentRoom]);

//   useEffect(() => () => wsRef.current?.close(), []);
  


//   return (
//     <div className="flex bg-gray-100 h-screen">
//       <MessageList
//         rooms={rooms}
//         selectedId={selectedId}
//         setSelectedId={setSelectedId}
//         setResiverDetail={setResiverDetail}
//       />
//       <ChatWindow
//         room={currentRoom}
//         loading={loading}
//         onSend={sendMessage}
//         resiverDetail={resiverDetail}
//         userId={userId}
//         handleVideoCallFunc={handleVideoCall}
//         handleVoiceCallFunc={handleVoiceCall}
//         setCountRow={setCountRow}
//         setLimit={setLimit}
//         hasMore={hasMore}
//         setHasMore={setHasMore}
//         setCurrentRoom={setCurrentRoom}
//         selectedId={selectedId}
//         setSelectedId={setSelectedId}
//         setLoading={setLoading}
//         setRooms={setRooms}
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



































import { useState, useEffect, useRef, useCallback } from "react";
import axiosInspector from "../../http/axiosMain.js";
import MessageList from "../../component/MessageList.jsx";
import ChatWindow from "../../component/ChatWindow.jsx";

// WebSocket base URL
const WS_BASE_URL = "wss://loveai-api.vrajtechnosys.in/ws/chat/";

export default function MessagePage() {
  // --------------------- State Variables ---------------------
  const [rooms, setRooms] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [resiverDetail, setResiverDetail] = useState(null);
  const [currentRoom, setCurrentRoom] = useState({ chat: [], log: "" });
  const [loading, setLoading] = useState(true);
  const [countRow, setCountRow] = useState(0);
  const [limit, setLimit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [showVoiceCall, setShowVoiceCall] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);

  const wsRef = useRef(null);

  // Extract user data from local storage
  const { token, id: userId } = JSON.parse(localStorage.getItem("user_Data") || "{}");

  // --------------------- UI Handlers ---------------------
  const handleVoiceCall = () => setShowVoiceCall(true);
  const handleVideoCall = () => setShowVideoCall(true);

  // --------------------- Load Chatrooms ---------------------
  useEffect(() => {
    const loadRooms = async () => {
      try {
        setLoading(true);
        const res = await axiosInspector.get("/chatrooms");
        const list = res.data.list.map((r) => ({
          ...r,
          lastMessage: r.last_message?.message || "",
          chat: [],
        }));

        setRooms(list);

        // Set default selected room
        const defaultRoomId = selectedId || list[0]?.chat_room_id;
        if (defaultRoomId) {
          setSelectedId(defaultRoomId);
          const selectedRoom = list.find((r) => r.chat_room_id === defaultRoomId);
          setResiverDetail(selectedRoom);
        }
      } catch (err) {
        console.error("Error loading chatrooms:", err);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, [selectedId]);

  // --------------------- Connect WebSocket When Room Changes ---------------------
  useEffect(() => {
    if (!selectedId) return;

    setCurrentRoom({ chat: [], log: "" });
    setHasMore(true);
    setCountRow(0);
    setLimit(10);
    setLoading(true);

    connectSocket(selectedId);

    setLoading(false);
  }, [selectedId]);

  // --------------------- WebSocket Connection ---------------------
  const connectSocket = useCallback(
    (roomId) => {
      if (!roomId || !token) return;

      if (wsRef.current) wsRef.current.close();

      const ws = new WebSocket(`${WS_BASE_URL}${roomId}?authorization=${token}`);
      wsRef.current = ws;

      ws.onmessage = (evt) => {
        try {
          const data = JSON.parse(evt.data);
          const { from, message, room_id, message_type } = data;
          const isMe = from === String(userId);

          if (room_id !== roomId) return;

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

          setCurrentRoom((prev) => ({
            ...prev,
            chat: [{ message, isMe, message_type }, ...prev.chat],
          }));
        } catch (err) {
          console.error("WebSocket message error:", err);
        }
      };
    },
    [token, userId]
  );

  // --------------------- Fetch Chat History ---------------------
  const fetchChatHistory = useCallback(() => {
    if (!selectedId || !hasMore || loading) return;

    setLoading(true);
    axiosInspector
      .get(`/chatrooms/${selectedId}/chats?start=${countRow}&limit=${limit}`, {
        headers: { token },
      })
      .then((res) => {
        const history = res.data.list.map((m) => ({
          message: m.message,
          isMe: m.sender.id === userId,
          message_type: m.message_type || "Msg",
        }));

        if (history.length < 5) setHasMore(false);

        setRooms((prev) =>
          prev.map((r) =>
            r.chat_room_id === selectedId
              ? { ...r, chat: [...(r.chat || []), ...history] }
              : r
          )
        );

        setCurrentRoom((prev) => ({
          ...prev,
          chat: [...prev.chat, ...history],
        }));
      })
      .catch((err) => {
        console.error("Error fetching older messages:", err);
      })
      .finally(() => setLoading(false));
  }, [selectedId, limit, countRow, token, userId]);

  // Trigger fetch when pagination changes
  useEffect(() => {
    if (selectedId && hasMore) {
      fetchChatHistory();
    }
  }, [countRow, limit, selectedId]);

  // --------------------- Send Message ---------------------
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

      // Update local UI
      const messageData = { message: msg, isMe: true, message_type: type };

      setCurrentRoom((prev) => ({
        ...prev,
        chat: [messageData, ...prev.chat],
      }));

      setRooms((prev) =>
        prev.map((r) =>
          r.chat_room_id === selectedId
            ? {
                ...r,
                chat: [messageData, ...r.chat],
                lastMessage: msg,
              }
            : r
        )
      );
    },
    [selectedId, resiverDetail?.user?.id]
  );

  // Cleanup WebSocket on unmount
  useEffect(() => {
    return () => wsRef.current?.close();
  }, []);

  // --------------------- Render UI ---------------------
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
        setCountRow={setCountRow}
        setLimit={setLimit}
        limit={limit}
        hasMore={hasMore}
        setHasMore={setHasMore}
        setSelectedId={setSelectedId}
        setLoading={setLoading}
      />

      {/* Optional: Call screens - Implement as needed */}
      {/* {showVoiceCall && <VoiceCallScreen />} */}
      {/* {showVideoCall && <VideoCallStart onClose={() => setShowVideoCall(false)} />} */}
    </div>
  );
}
