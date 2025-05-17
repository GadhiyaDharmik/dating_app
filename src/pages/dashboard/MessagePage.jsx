import React, { useState, useEffect, useRef, useCallback } from "react";
import userImg from "../../assets/bgImage.png";
import { Phone, Send } from "lucide-react";
import axiosInspector from "../../http/axiosMain.js";

const WS_BASE_URL = "wss://loveai-api.vrajtechnosys.in/ws/chat/";

function MessageList({ rooms, selectedId, setSelectedId, setResiverDetail }) {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b font-semibold text-lg">Messages</div>
      <div className="flex-1 overflow-y-auto custom-scroll">
        {rooms.map((room) => (
          <div
            key={room.chat_room_id}
            onClick={() => {
              setResiverDetail(room);
              setSelectedId(room.chat_room_id);
            }}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${selectedId === room.chat_room_id ? "bg-blue-100" : ""
              } hover:bg-gray-100`}
          >
            <img
              src={room.user?.url || userImg}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <div className="font-medium">{room.user?.name}</div>
              <div className="text-sm text-gray-500 truncate">
                {room.lastMessage}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatWindow({ room, loading, onSend }) {
  const [input, setInput] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    if (!loading && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
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
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-6 py-4">
        <img
          src={room.user?.url || userImg}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <div className="font-semibold">{room.user?.name}</div>
          <div className="text-xs text-green-500">
            {room.user?.is_online ? "Online" : "Offline"}
          </div>
        </div>
        <Phone size={20} className="text-blue-500" />
      </div>

      {/* Messages */}
      {/* <textarea
        readOnly
        className="w-full h-32 p-2 bg-gray-100 text-sm mb-2"
        value={room.log || ""}
      /> */}

      <div
        ref={containerRef}
        className="flex-1 px-6 py-4 space-y-3 overflow-y-auto custom-scroll"
      >
        {[...room.chat || []]
          .reverse()
          .map((m, i) => (
            <div
              key={i}
              className={`flex items-end gap-2 ${m.isMe ? "justify-end" : "justify-start"
                }`}
            >
              {!m.isMe && (
                <img src={userImg} className="w-8 h-8 rounded-full" />
              )}
              <div
                className={`px-4 py-2 rounded-2xl max-w-xs ${m.isMe
                  ? "bg-blue-100 text-blue-900"
                  : "bg-gray-100 text-gray-900"
                  }`}
              >
                {m.message}
              </div>
            </div>
          ))}
      </div>

      {/* Input */}
      <div className="border-t px-6 py-4 flex items-center gap-3">
        <input
          id="messageInput"
          type="text"
          placeholder="Type a message…"
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
          onClick={() => {
            onSend(input);
            setInput("");
          }}
          className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Send size={20} />
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

  // 1️⃣ Fetch rooms
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

  // 2️⃣ connectSocket
  const connectSocket = useCallback(
    (roomId) => {
      // close old
      if (wsRef.current) wsRef.current.close();

      const url = `${WS_BASE_URL}${roomId}?authorization=${token}`;
      const ws = new WebSocket(url);
      wsRef.current = ws;

      let log = "";

      ws.onopen = () => {
        log += "[Connected]\n";
        setCurrentRoom((r) => ({ ...r, log }));
      };
      ws.onmessage = (evt) => {
        log += "[Received] " + evt.data + "\n";

        try {
          const data = JSON.parse(evt.data);
          const { from, message, room_id, type, created_at } = data;
          const isMe = from === String(userId);

          // Update all rooms
          setRooms((prev) =>
            prev.map((r) =>
              r.chat_room_id === room_id
                ? {
                  ...r,
                  chat: [{ message, isMe, created_at, type }, ...r.chat],
                  lastMessage: message,
                }
                : r
            )
          );

          // Update current room if it matches
          if (room_id === selectedId) {
            setCurrentRoom((r) => ({
              ...r, // retain user, log, etc.
              chat: [{ message, isMe}, ...r.chat],
              log,
            }));
          }
        } catch (err) {
          console.error("Failed to parse WebSocket message:", err);
        }
      };

      // ws.onmessage = (evt) => {
      //   log += "[Received] " + evt.data + "\n";
      //   const parts = evt.data.split(":");
      //   if (parts.length >= 2) {
      //     const sender = parts.shift();
      //     const message = parts.join(":");
      //     const isMe = sender === String(userId);

      //     setRooms((prev) =>
      //       prev.map((r) =>
      //         r.chat_room_id === roomId
      //           ? {
      //             ...r,
      //             chat: [...r.chat, { message, isMe }],
      //             lastMessage: message,
      //           }
      //           : r
      //       )
      //     );
      //     setCurrentRoom((r) => ({ ...r, chat: r.chat, log }));
      //   }
      // };
      ws.onerror = (e) => {
        log += "[Error] " + e.message + "\n";
        setCurrentRoom((r) => ({ ...r, log }));
      };
      ws.onclose = (e) => {
        log += `[Disconnected] Code: ${e.code}\n`;
        setCurrentRoom((r) => ({ ...r, log }));
      };
    },
    [token, userId]
  );

  // 3️⃣ sendMessage
  const sendMessage = useCallback(
    (msg, toId) => {
      if (!wsRef.current || wsRef.current.readyState !== 1) {
        return console.warn("Not open");
      }
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
    },
    []
  );

  // 4️⃣ When room changes
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

  // cleanup
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
      />
    </div>
  );
}
