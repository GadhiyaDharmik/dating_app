import { useState, useEffect, useRef, useCallback } from "react";
import axiosInspector from "../../http/axiosMain.js";
import MessageList from "../../component/MessageList.jsx";
import ChatWindow from "../../component/ChatWindow.jsx";
// import AgoraRTC from "agora-rtc-sdk-ng";
const WS_BASE_URL = "wss://loveai-api.vrajtechnosys.in/ws/chat/";

export default function MessagePage() {
  const [rooms, setRooms] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [resiverDetail, setResiverDetail] = useState(null);
  const [currentRoom, setCurrentRoom] = useState({ chat: [], log: "" });
  const [loading, setLoading] = useState(false);
  const wsRef = useRef(null);

  const [showVoiceCall, setShowVoiceCall] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);

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
      .get(`/chatrooms/${selectedId}/chats?start=0&limit=10`, {
        headers: { token },
      })
      .then((res) => {
        const history = res.data.list.map((m) => ({
          message: m.message,
          isMe: m.sender.id === userId,
          message_type: m.message_type || "Msg",
        }));
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
