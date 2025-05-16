import React, { useState, useEffect, useRef } from "react";
import userImg from "../../assets/bgImage.png";
import { Phone, Send } from "lucide-react";
import axiosInspector from "../../http/axiosMain.js";

const WS_BASE_URL = "wss://loveai-api.vrajtechnosys.in/ws/chat";

function MessageList({ messages, selectedId, setSelectedId, setResiverDetail }) {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b font-semibold text-lg">Messages</div>
      <div className="flex-1 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.chat_room_id}
            onClick={() => {
              setResiverDetail(msg);
              setSelectedId(msg.chat_room_id);
            }}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${
              selectedId === msg.chat_room_id ? "bg-blue-100" : ""
            } hover:bg-gray-100`}
          >
            <img
              src={msg?.user?.url || userImg}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <div className="font-medium">{msg?.user?.name}</div>
              <div className="text-sm text-gray-500 truncate">
                {msg?.lastMessage}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatWindow({ contact, loading, onSend }) {
  const [input, setInput] = useState("");

  if (loading || !contact) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Loading conversation...
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="flex items-center gap-3 border-b px-6 py-4">
        <img
          src={contact?.user?.url || userImg}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <div className="font-semibold">{contact?.user?.name}</div>
          <div className="text-xs text-green-500">
            {contact?.user?.is_online ? "Online" : "Offline"}
          </div>
        </div>
        <Phone size={20} className="text-blue-500" />
      </div>

      <div className="flex-1 px-6 py-4 space-y-3 overflow-y-auto">
        {contact.chat.map((msg, idx) => {
          return (
            <div
              key={idx}
              className={`flex items-end gap-2 ${
                msg.fromMe ? "justify-end" : "justify-start"
              }`}
            >
              {!msg.fromMe && <img src={userImg} className="w-8 h-8 rounded-full" />}
              <div
                className={`px-4 py-2 rounded-2xl max-w-xs ${
                  msg.fromMe
                    ? "bg-blue-100 text-blue-900"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t px-6 py-4 flex items-center gap-3">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-full border border-gray-300"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && input.trim()) {
              onSend(input.trim());
              setInput("");
            }
          }}
        />
        <button
          className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
          onClick={() => {
            if (input.trim()) {
              onSend(input.trim());
              setInput("");
            }
          }}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}

export default function MessagePage() {
  const [messages, setMessages] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [resiverDetail, setResiverDetail] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const wsRef = useRef(null);

  const userData = JSON.parse(localStorage.getItem("user_Data")) || {};
  const { token, id: userId } = userData;

  // 1️⃣ Fetch rooms
  useEffect(() => {
    axiosInspector
      .get("/chatrooms")
      .then((res) => {
        const rooms = res.data.list || [];
        const formatted = rooms.map((room) => ({
          ...room,
          lastMessage: room.last_message?.message || "",
          chat: [],
        }));
        setMessages(formatted);
        if (formatted.length) {
          // setSelectedId(formatted[0].chat_room_id);
          setResiverDetail(formatted[0]);
        }
      })
      .catch(console.error);
  }, []);

  // 2️⃣ Load history + open WS whenever selectedId changes
  useEffect(() => {
    if (!selectedId || !token) return;

    setLoading(true);
    setSelectedMessage(null);

    // load chat history
    axiosInspector
      .get(`/chatrooms/${selectedId}/chats?start=0&limit=60`, {
        headers: { token },
      })
      .then((res) => {
        const chatMessages = res.data.list.map((msg) => ({
          text: msg.message,
          fromMe: msg.sender.id === userId,
        }));
        const room = messages.find((m) => m.chat_room_id === selectedId);
        const updatedRoom = { ...room, chat: chatMessages };
        setSelectedMessage(updatedRoom);
        setMessages((prev) =>
          prev.map((m) =>
            m.chat_room_id === selectedId ? updatedRoom : m
          )
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    // teardown previous WS
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    // build & open new WS
    const wsUrl = `${WS_BASE_URL}/${selectedId}?token=${token}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => console.log("✅ WS connected:", wsUrl);
    ws.onmessage = (evt) => {
      try {
        const { message, from: roomId, sender_id } = JSON.parse(evt.data);
        const isFromMe = sender_id === userId;

        setMessages((prev) =>
          prev.map((room) => {
            if (room.chat_room_id === roomId) {
              const updatedChat = [...(room.chat || []), { text: message, fromMe: isFromMe }];
              const updated = {
                ...room,
                chat: updatedChat,
                lastMessage: message,
              };
              if (roomId === selectedId) {
                setSelectedMessage(updated);
              }
              return updated;
            }
            return room;
          })
        );
      } catch (err) {
        console.error("❌ WS parse failed:", err);
      }
    };
    ws.onerror = (err) => console.error("❌ WS error:", err);
    ws.onclose = () => console.log("🔌 WS closed");

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [selectedId, token, userId, messages]);

  // 3️⃣ Send a message
  const handleSend = (text) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return console.warn("WS not open");
    }

    const payload = {
      to: resiverDetail.user.id,
      message: text,
      file: null,
      file_path: null,
      message_type: "Msg",
    };

    wsRef.current.send(JSON.stringify(payload));

    // optimistic UI update
    const updated = {
      ...selectedMessage,
      chat: [...selectedMessage.chat, { text, fromMe: true }],
      lastMessage: text,
    };
    setMessages((prev) =>
      prev.map((m) =>
        m.chat_room_id === selectedMessage.chat_room_id ? updated : m
      )
    );
    setSelectedMessage(updated);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <MessageList
        messages={messages}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        setResiverDetail={setResiverDetail}
      />
      <ChatWindow
        contact={selectedMessage}
        loading={loading}
        onSend={handleSend}
      />
    </div>
  );
}
