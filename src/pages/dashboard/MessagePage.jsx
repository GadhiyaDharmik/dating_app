import React, { useState, useEffect, useRef, useCallback } from "react";
import userImg from "../../assets/bgImage.png";
import { Phone, Send } from "lucide-react";
import axiosInspector from "../../http/axiosMain.js";

const WS_BASE_URL = "wss://loveai-api.vrajtechnosys.in/ws/chat/";

function MessageList({ rooms, selectedId, setSelectedId, setResiverDetail }) {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-none font-semibold text-lg">Messages</div>
      <div className="flex-1 overflow-y-auto custom-scroll">
        {rooms.map((room) => (
          <div
            key={room.chat_room_id}
            onClick={() => {
              setResiverDetail(room);
              setSelectedId(room.chat_room_id);
            }}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all rounded-xl m-2 
              ${
                selectedId === room.chat_room_id
                  ? "bg-[#E8F8FF]"
                  : "hover:bg-gray-50"
              }`}
          >
            <img
              src={room.user?.url || userImg}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="font-medium text-sm">{room.user?.name}</div>
              <div className="text-xs text-gray-500 truncate">
                {room.lastMessage}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatWindow({ room, loading, onSend, resiverDetail }) {
  const [input, setInput] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    if (!loading && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
    // console.log(resiverDetail, "roomroomroom");
  }, [room?.chat, loading]);

  if (loading || !room) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
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
          <button className="w-8 h-8 flex items-center justify-center rounded-md bg-green-100 text-green-500">
            <Phone size={16} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-100 text-gray-500">
            ...
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex-1 px-6 py-4 space-y-3 overflow-y-auto custom-scroll max-h-[calc(100vh-180px)]"
      >
        {[...(room.chat || [])].reverse().map((m, i) => (
          <div
            key={i}
            className={`flex gap-2 ${
              m.isMe ? "justify-end" : "justify-start"
            } items-end`}
          >
            {!m.isMe && (
              <img
                src={resiverDetail?.user?.url || userImg}
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <div
              className={`px-4 py-2 rounded-xl text-sm max-w-[70%] shadow
                ${
                  m.isMe
                    ? "bg-gray-800 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-900 rounded-bl-none"
                }`}
            >
              {m.message}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t px-4 py-3 flex items-center bg-white gap-2">
        <input
          type="text"
          placeholder="Type a message…"
          className="flex-1 px-4 py-2 text-sm rounded-full border border-gray-200 shadow-sm focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && input.trim()) {
              onSend(input);
              setInput("");
            }
          }}
        />
        <button
          onClick={() => {
            onSend(input);
            setInput("");
          }}
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
          const { from, message, room_id } = data;
          const isMe = from === String(userId);

          setRooms((prev) =>
            prev.map((r) =>
              r.chat_room_id === room_id
                ? {
                    ...r,
                    chat: [{ message, isMe }, ...r.chat],
                    lastMessage: message,
                  }
                : r
            )
          );

          if (room_id === selectedId) {
            setCurrentRoom((r) => ({
              ...r,
              chat: [{ message, isMe }, ...r.chat],
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
    (msg, toId) => {
      if (!wsRef.current || wsRef.current.readyState !== 1) return;
      const payload = {
        to: toId,
        message: msg,
        file: null,
        file_path: null,
        message_type: "Msg",
      };
      wsRef.current.send(JSON.stringify(payload));
      setCurrentRoom((r) => ({
        ...r,
        chat: [{ message: msg, isMe: true }, ...r.chat],
      }));
      setRooms((prev) =>
        prev.map((r) =>
          r.chat_room_id === selectedId
            ? {
                ...r,
                chat: [{ message: msg, isMe: true }, ...r.chat],
                lastMessage: msg,
              }
            : r
        )
      );
    },
    [selectedId]
  );

  useEffect(() => {
    if (!selectedId) return;
    setLoading(true);
    axiosInspector
      .get(`/chatrooms/${selectedId}/chats?start=0&limit=60`, {
        headers: { token },
      })
      .then((res) => {
        const history = res.data.list.map((m) => ({
          message: m.message,
          isMe: m.sender.id === userId,
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
        onSend={(txt) => sendMessage(txt, resiverDetail.user.id)}
        resiverDetail={resiverDetail}
      />
    </div>
  );
}
