import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../../component/SideBar.jsx';
import userImg from '../../assets/bgImage.png';
import { Phone, Send } from 'lucide-react';
import axiosInspector from '../../http/axiosMain.js';

const WS_BASE_URL = 'ws://13.203.229.149:4444/ws/chat'; // Use wss:// if over HTTPS

const initialMessages = [
  {
    id: 'user-1',
    name: 'Elmer Laverty',
    lastMessage: 'Haha oh man 😂',
    time: '12m',
    unread: true,
    avatar: userImg,
    chat: [],
  },
  {
    id: 'user-2',
    name: 'Florencio Dorrance',
    lastMessage: 'woohooo🔥',
    time: '24m',
    unread: false,
    avatar: userImg,
    chat: [],
  },
];

function MessageList({ messages, selectedId, setSelectedId }) {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200 font-semibold text-lg">
        Messages <span className="text-gray-400">{messages.length}</span>
      </div>
      <div className="p-2">
        <input
          type="text"
          placeholder="Search messages"
          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none"
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg?.chat_room_id}
            onClick={() => setSelectedId(msg?.chat_room_id)}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${selectedId === msg.id ? 'bg-blue-50' : ''
              } hover:bg-gray-100`}
          >
            <img src={msg?.user?.avatar} alt={msg?.user?.name} className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <div className="font-medium">{msg?.user?.name}</div>
              <div className="text-sm text-gray-500 truncate">{msg.user?.lastMessage}</div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-400">{msg?.user?.time}</span>
              {msg?.user?.unread && <span className="w-2 h-2 bg-blue-500 rounded-full mt-1"></span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatWindow({ contact, loading, onSend }) {
  const [input, setInput] = useState('');

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Loading conversation...
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white text-gray-400">
        Select a conversation
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-4">
        <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full" />
        <div className="flex-1">
          <div className="font-semibold">{contact.name}</div>
          <div className="text-xs text-green-500">Online</div>
        </div>
        <button className="p-2 rounded-full hover:bg-blue-50">
          <Phone size={20} className="text-blue-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {contact.chat.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`px-4 py-2 rounded-2xl max-w-xs ${msg.fromMe ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-900'
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 px-6 py-4 flex items-center gap-3">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && input.trim()) {
              onSend(input);
              setInput('');
            }
          }}
        />
        <button
          className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
          onClick={() => {
            if (input.trim()) {
              onSend(input);
              setInput('');
            }
          }}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}

function MessagePage() {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const wsRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("user_Data")) || { id: "<USER_ID>" };

  // Cleanup WebSocket on unmount
  useEffect(() => {
    axiosInspector.get(`/chatrooms`)
      .then((res) => {
        setMessages(res.data.list || []); // Adjust based on actual structure
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch profiles", err);
        setLoading(false);
      });
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Fetch room and open WebSocket connection
  useEffect(() => {
    if (!selectedId) return;
    console.log(selectedId)
    const fetchChatRoom = async () => {
      setLoading(true);
      setSelectedMessage(null);

      try {
        // const response = await axiosMain.post(`/chatrooms?target_user_id=${selectedId}`);
        // const response = await axiosInspector.get(`/chatrooms`);
        // const roomData = response.data;
        const ws = new WebSocket(`${WS_BASE_URL}/${selectedId}`);

        ws.onopen = () => {
          console.log('Connected to WebSocket room:', selectedId);
        };

        ws.onmessage = (event) => {
          try {
            const payload = JSON.parse(event.data);
            const { message, from } = payload;

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === from
                  ? {
                    ...msg,
                    chat: [...msg.chat, { fromMe: false, text: message }],
                    lastMessage: message,
                    unread: true,
                  }
                  : msg
              )
            );
          } catch (err) {
            console.error('Error parsing WebSocket message:', err);
          }
        };

        ws.onerror = (err) => console.error('WebSocket error:', err);
        ws.onclose = () => console.log('WebSocket disconnected');

        wsRef.current = ws;

        const contact = messages.find((msg) => msg.id === selectedId);
        if (contact) {
          setSelectedMessage({
            ...contact,
            roomId: selectedId,
          });
        }
      } catch (err) {
        console.error('Failed to fetch chat room:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChatRoom();
  }, [selectedId, messages]);

  // Send message through WebSocket
  const handleSend = (text) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN || !selectedMessage?.roomId)
      return;

    const payload = {
      to: selectedMessage.id,
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
      time: 'now',
    };

    setMessages((prev) =>
      prev.map((msg) => (msg.id === selectedId ? updatedContact : msg))
    );
    setSelectedMessage(updatedContact);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <MessageList messages={messages} selectedId={selectedId} setSelectedId={setSelectedId} />
      <ChatWindow contact={selectedMessage} loading={loading} onSend={handleSend} />
    </div>
  );
}

export default MessagePage;
