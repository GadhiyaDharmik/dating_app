import React, { useState, useEffect, useRef } from "react";
import userImg from "../../assets/bgImage.png";
import { Phone, Send } from "lucide-react";
import axiosInspector from "../../http/axiosMain.js";

const WS_BASE_URL = "wss://loveai-api.vrajtechnosys.in/ws/chat";

function MessageList({ messages, selectedId, setSelectedId, setResiverDetail }) {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b font-semibold text-lg">Messages</div>
      <div className="flex-1 overflow-y-auto custom-scroll">
        {messages.map((msg) => (
          <div
            key={msg.chat_room_id}
            onClick={() => {
              setResiverDetail(msg);
              setSelectedId(msg.chat_room_id);
            }}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${selectedId === msg.chat_room_id ? "bg-blue-100" : ""
              } hover:bg-gray-100`}
          >
            <img
              src={msg.user?.url || userImg}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <div className="font-medium">{msg.user?.name}</div>
              <div className="text-sm text-gray-500 truncate">
                {msg.lastMessage}
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
  const containerRef = useRef(null);

  // auto-scroll to bottom on new messages
  useEffect(() => {
    if (!loading && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [contact?.chat, loading]);

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
          src={contact.user?.url || userImg}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <div className="font-semibold">{contact.user?.name}</div>
          <div className="text-xs text-green-500">
            {contact.user?.is_online ? "Online" : "Offline"}
          </div>
        </div>
        <Phone size={20} className="text-blue-500" />
      </div>

      <div
        ref={containerRef}
        className="flex-1 px-6 py-4 space-y-3 overflow-y-auto custom-scroll"
      >
        {[...contact.chat || []]
          .map((msg, idx) => {
            const isFromMe = msg.fromMe;
            return (
              <div
                key={idx}
                className={`flex items-end gap-2 ${isFromMe ? "justify-end" : "justify-start"
                  }`}
              >
                {!isFromMe && (
                  <img src={userImg} className="w-8 h-8 rounded-full" />
                )}
                <div
                  className={`px-4 py-2 rounded-2xl max-w-xs ${isFromMe
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
  const [resiverDetail, setResiverDetail] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const wsRef = useRef(null);

  const userData = JSON.parse(localStorage.getItem("user_Data"));
  const token = userData?.token;
  const userId = userData?.id;

  // Helper to fetch the last 60 messages for a room
  const fetchLatestChats = async (roomId) => {
    const res = await axiosInspector.get(
      `/chatrooms/${roomId}/chats?start=0&limit=60`,
      { headers: { token } }
    );
    return res.data.list.map((msg) => ({
      text: msg.message,
      fromMe: msg.sender.id === userId,
    }))?.reverse();
  };

  // 1️⃣ Fetch chatrooms once on mount
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
          setResiverDetail(formatted[0]);
          setSelectedId(formatted[0].chat_room_id);
        }
      })
      .catch((err) => console.error("Failed to fetch chatrooms:", err));
  }, []);

  // 2️⃣ When selectedId changes, load history and open WebSocket
  useEffect(() => {
    if (!selectedId || !token) return;
    setLoading(true);
    setSelectedMessage(null);

    // initial history load
    fetchLatestChats(selectedId)
      .then((chatMessages) => {
        setMessages((prev) => {
          const updated = prev.map((room) =>
            room.chat_room_id === selectedId
              ? {
                ...room,
                chat: chatMessages,
                lastMessage:
                  chatMessages[chatMessages.length - 1]?.text || "",
              }
              : room
          );
          const active = updated.find(
            (r) => r.chat_room_id === selectedId
          );
          setSelectedMessage(active);
          return updated;
        });
      })
      .catch((err) => console.error("Failed to load chat history:", err))
      .finally(() => setLoading(false));

    // open WebSocket
    const ws = new WebSocket(
      `${WS_BASE_URL}/${selectedId}?authorization=${token}`
    );
    wsRef.current = ws;

    ws.onopen = () =>
      console.log("✅ WebSocket connected to room", selectedId);

    ws.onmessage = (event) => {
      let payload;
      try {
        payload = JSON.parse(event.data);
      } catch {
        const [sender, ...rest] = event.data.split(":");
        payload = {
          from: sender,
          message: rest.join(":"),
          sender_id: sender,
        };
      }
      const isFromMe = payload.sender_id === userId;
      setMessages((prev) =>
        prev.map((room) => {
          if (room.chat_room_id !== payload.from) return room;
          const updatedRoom = {
            ...room,
            chat: [...(room.chat || []), { text: payload.message, fromMe: isFromMe }],
            lastMessage: payload.message,
          };
          if (room.chat_room_id === selectedId) {
            setSelectedMessage(updatedRoom);
          }
          return updatedRoom;
        })
      );
    };

    ws.onerror = (err) =>
      console.error("❌ WebSocket error for room", selectedId, err);
    ws.onclose = () =>
      console.log("🔌 WebSocket closed for room", selectedId);

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [selectedId, token]);

  // 3️⃣ Poll every 2s and only update if chat length changed
  useEffect(() => {
    if (!selectedId || !token) return;
    let cancelled = false;

    const poll = async () => {
      try {
        const newChat = await fetchLatestChats(selectedId);
        if (cancelled) return;
        setMessages((prev) =>
          prev.map((room) => {
            if (room.chat_room_id !== selectedId) return room;
            const oldChat = room.chat || [];
            if (newChat.length !== oldChat.length) {
              const updatedRoom = {
                ...room,
                chat: newChat,
                lastMessage: newChat[newChat.length - 1]?.text || "",
              };
              setSelectedMessage(updatedRoom);
              return updatedRoom;
            }
            return room;
          })
        );
      } catch (e) {
        console.error("Polling error:", e);
      }
    };

    // immediate + interval
    poll();
    const handle = setInterval(poll, 2000);
    return () => {
      cancelled = true;
      clearInterval(handle);
    };
  }, [selectedId, token]);

  // send a new message via WS
  const handleSend = (text) => {
    if (
      !selectedMessage ||
      !wsRef.current ||
      wsRef.current.readyState !== WebSocket.OPEN
    ) {
      console.warn("WebSocket is not connected.");
      return;
    }
    const payload = {
      to: resiverDetail?.user?.id,
      message: text,
      file: null,
      file_path: null,
      message_type: "Msg",
    };
    wsRef.current.send(JSON.stringify(payload));

    // echo locally
    const updatedChat = [
      ...(selectedMessage.chat || []),
      { fromMe: true, text },
    ];
    const updatedRoom = {
      ...selectedMessage,
      chat: updatedChat,
      lastMessage: text,
    };
    setMessages((prev) =>
      prev.map((r) =>
        r.chat_room_id === updatedRoom.chat_room_id
          ? updatedRoom
          : r
      )
    );
    setSelectedMessage(updatedRoom);
  };

  return (
    <div className="flex bg-gray-100 h-screen">
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
