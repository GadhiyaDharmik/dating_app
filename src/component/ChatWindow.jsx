import { useEffect, useRef, useState } from "react";
import VoiceCallComponent from "../pages/dashboard/VoiceCallComponent";
import { Paperclip, Send } from "lucide-react";
import userImg from "../assets/bgImage.png";
import videoCall from "../assets/Video-Call-Button.svg";
import Call from "../assets/Call Button.svg";
import axiosInspector from "../http/axiosMain.js";
import EmojiPicker from "emoji-picker-react";

const ChatWindow = ({
  room,
  loading,
  onSend,
  resiverDetail,
  userId,
  handleVideoCallFunc,
  handleVoiceCallFunc,
  setCountRow,
  setLimit,
  limit,
  hasMore,
  setLoading,
}) => {
  // ------------------ State & Refs ------------------
  const [input, setInput] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [pendingFiles, setPendingFiles] = useState([]);
  const containerRef = useRef(null);
  const { token } = JSON.parse(localStorage.getItem("user_Data") || "{}");
  const [callStatus, setCallStatus] = useState("idle");
  const [isVideo, setIsVideo] = useState(true);
  const voiceRef = useRef();

  // ------------------ Voice Call Trigger ------------------
  const handleVoiceCall = () => {
    voiceRef.current?.startCall();
    setCallStatus("calling");
  };

  // ------------------ Scroll to Load Older Messages ------------------
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = async () => {
      if (container.scrollTop === 0 && hasMore && !loading) {
        setLoading(true);
        const previousHeight = container.scrollHeight;

        // Update pagination
        setCountRow((prev) => prev + limit);
        setLimit(5); // Adjust page size dynamically

        requestAnimationFrame(() => {
          const newHeight = container.scrollHeight;
          container.scrollTop = newHeight - previousHeight;
          setLoading(false);
        });
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  // ------------------ Emoji Handler ------------------
  const onEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
    setShowPicker(false);
  };

  // ------------------ Send Message & File Handler ------------------
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
            token,
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

          onSend(file.url, type, type === "Image" ? file.path : null);
        }

        setPendingFiles([]);
      } catch (err) {
        console.error("Media upload failed:", err);
      }
    }
  };

  // ------------------ UI ------------------
  return (
    <div className="flex-1 flex flex-col h-full bg-white rounded-md overflow-hidden">
      
      {/* ------------ Header ------------ */}
      <div className="flex items-center justify-between px-4 py-3 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src={resiverDetail?.user?.url || userImg}
            alt="Receiver"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="font-semibold text-sm sm:text-base text-gray-900">
              {resiverDetail?.user?.name || "Unknown User"}
            </div>
            <div
              className={`text-xs ${
                resiverDetail?.user?.is_online ? "text-green-500" : "text-gray-400"
              }`}
            >
              {resiverDetail?.user?.is_online ? "Online" : "Offline"}
            </div>
          </div>
        </div>

        {/* Call Buttons */}
        <div className="flex items-center gap-2">
          <button
            className="w-9 h-9 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center"
            onClick={() => {
              handleVoiceCall();
              setIsVideo(true);
            }}
          >
            <img src={videoCall} alt="Video Call" className="w-5 h-5" />
          </button>

          <button
            className="w-9 h-9 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center"
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

      {/* ------------ Chat Messages ------------ */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto bg-gray-50 px-4 py-3 space-y-4 custom-scroll"
      >
        {loading && (
          <div className="text-center text-sm text-gray-500 py-2">
            Loading older messages...
          </div>
        )}

        {[...room?.chat].reverse().map((msg, index) => (
          <div key={index} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
            {/* Receiver Avatar */}
            {!msg.isMe && (
              <img
                src={resiverDetail?.user?.url || userImg}
                alt="Receiver"
                className="w-8 h-8 rounded-full mr-2 self-end"
              />
            )}

            {/* Message Bubble */}
            <div
              className={`max-w-xs sm:max-w-md px-4 py-2 rounded-2xl shadow-md text-sm break-words whitespace-pre-wrap overflow-hidden ${
                msg.isMe
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white text-gray-900 rounded-bl-none"
              }`}
            >
              {["Image", "Gif"].includes(msg.message_type) ? (
                <img
                  src={msg.message}
                  alt="chat-media"
                  className="object-contain h-[200px] w-full"
                  onError={(e) => (e.target.src = userImg)}
                />
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

            {/* Sender Avatar */}
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

      {/* ------------ File Previews ------------ */}
      {pendingFiles.length > 0 && (
        <div className="flex gap-2 px-4 py-2 overflow-x-auto bg-white">
          {pendingFiles.map((file, idx) => {
            const url = URL.createObjectURL(file);
            return file.type.startsWith("image/") ? (
              <img key={idx} src={url} className="w-16 h-16 rounded object-cover" alt="preview" />
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

      {/* ------------ Input Section ------------ */}
      <div className="px-4 py-3 bg-white">
        <div className="flex items-center gap-2 relative">
          
          {/* Emoji Picker */}
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

          {/* File Upload */}
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

          {/* Text Input */}
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

          {/* Send Button */}
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
