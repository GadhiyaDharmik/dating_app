import React, { useState, useEffect, useRef } from "react";
import userImg from "../../assets/bgImage.png";
import { Phone, Send } from "lucide-react";
import axiosInspector from "../../http/axiosMain.js";

const WS_BASE_URL = "ws://13.201.224.164:4444/ws/chat";

function MessageList({ messages, selectedId, setSelectedId }) {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200 font-semibold text-lg">
        Messages <span className="text-gray-400">{messages.length}</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.chat_room_id}
            onClick={() => setSelectedId(msg.chat_room_id)}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${
              selectedId === msg.chat_room_id ? "bg-blue-50" : ""
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
  const currentUserId = JSON.parse(localStorage.getItem("user_Data"))?.id;

  if (loading || !contact) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Loading conversation...
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-4">
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

      {/* Message list */}
      <div
        className="flex-1 px-6 py-4 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        style={{ maxHeight: "calc(100vh - 140px)" }} // adjust if needed
      >
        {contact.chat.map((msg, idx) => {
          const isFromMe = msg.fromMe ?? msg.sender?.id === currentUserId;
          const avatarUrl = msg.sender?.url || userImg;
          return (
            <div
              key={idx}
              className={`flex items-end gap-2 ${
                isFromMe ? "justify-end" : "justify-start"
              }`}
            >
              {!isFromMe && (
                <img
                  src={avatarUrl}
                  alt="sender"
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div
                className={`px-4 py-2 rounded-2xl max-w-xs ${
                  isFromMe
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

      {/* Input */}
      <div className="border-t border-gray-200 px-6 py-4 flex items-center gap-3">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-full border border-gray-300"
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
          className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
          onClick={() => {
            if (input.trim()) {
              onSend(input);
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
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const wsRef = useRef(null);

  const token = JSON.parse(localStorage.getItem("user_Data"))?.token;
  const userId = JSON.parse(localStorage.getItem("user_Data"))?.id;

  // Load chatrooms only once
  useEffect(() => {
    axiosInspector
      .get("/chatrooms")
      .then((res) => {
        const rooms = res.data.list || [];

        const formatted = rooms.map((room) => ({
          ...room,
          lastMessage: room.last_message?.message || "",
          chat: room.last_message
            ? [
                {
                  text: room.last_message.message,
                  fromMe: room.last_message.sender_id === userId,
                },
              ]
            : [],
        }));

        setMessages(formatted);

        if (formatted.length > 0) {
          setSelectedId(formatted[0].chat_room_id);
          // setSelectedMessage(formatted[0]);
        }
      })
      .catch((err) => console.error("Failed to fetch chatrooms:", err));
  }, []);

  useEffect(() => {
    if (!selectedId || !token) return;

    setLoading(true);
    setSelectedMessage(null);

    // Connect WebSocket
    const ws = new WebSocket(`${WS_BASE_URL}/${selectedId}?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const { message, from, sender_id } = JSON.parse(event.data);
        const isFromMe = sender_id === userId;

        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.chat_room_id === from) {
              const updatedChat = [
                ...(msg.chat || []),
                { fromMe: isFromMe, text: message },
              ];
              const updated = {
                ...msg,
                chat: updatedChat,
                lastMessage: message,
              };

              if (from === selectedId) {
                setSelectedMessage(updated);
              }

              return updated;
            }
            return msg;
          })
        );
      } catch (err) {
        console.error("WebSocket message parse error:", err);
      }
    };

    ws.onerror = (err) => console.error("WebSocket error:", err);
    ws.onclose = () => console.log("WebSocket closed");

    // 🔹 Fetch Chat History from `/chatrooms/{room_id}/chats`
    axiosInspector
      .get(`/chatrooms/${selectedId}/chats`, {
        params: { start: 0, limit: 60 },
        headers: { token },
      })
      .then((res) => {
        const chatMessages = res.data.list.map((msg) => ({
          text: msg.message,
          fromMe: msg.sender.id === userId,
        }));

        const room = messages.find((m) => m.chat_room_id === selectedId);
        if (room) {
          const updatedRoom = {
            ...room,
            chat: chatMessages,
          };
          setSelectedMessage(updatedRoom);
          setMessages((prev) =>
            prev.map((m) => (m.chat_room_id === selectedId ? updatedRoom : m))
          );
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load chat history:", err);
        setLoading(false);
      });

    return () => {
      ws.close();
    };
  }, [selectedId]);

  const handleSend = (text) => {
    if (
      !wsRef.current ||
      wsRef.current.readyState !== WebSocket.OPEN ||
      !selectedMessage
    )
      return;

    const payload = {
      to: selectedMessage.chat_room_id,
      message: text,
      file: null,
      file_path: null,
      message_type: "Msg",
    };

    wsRef.current.send(JSON.stringify(payload));

    const updatedChat = [...selectedMessage.chat, { fromMe: true, text }];
    const updatedContact = {
      ...selectedMessage,
      chat: updatedChat,
      lastMessage: text,
    };

    setMessages((prev) =>
      prev.map((msg) =>
        msg.chat_room_id === selectedMessage.chat_room_id ? updatedContact : msg
      )
    );
    setSelectedMessage(updatedContact);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <MessageList
        messages={messages}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
      />
      <ChatWindow
        contact={selectedMessage}
        loading={loading}
        onSend={handleSend}
      />
    </div>
  );
}
