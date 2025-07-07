import userImg from "../assets/bgImage.png";

/**
 * MessageList - Sidebar that displays all chat rooms.
 *
 * @param {Object[]} rooms - Array of chat room objects
 * @param {string|null} selectedId - Currently selected room ID
 * @param {Function} setSelectedId - Callback to change selected room
 */
const MessageList = ({ rooms, selectedId, setSelectedId }) => {
  return (
    <div className="w-80 bg-white border-r border-gray-200 h-screen flex flex-col">
      
      {/* Header */}
      <div className="p-4 font-semibold text-lg">Messages</div>

      {/* Search Input (Non-functional placeholder for now) */}
      <div className="flex justify-center pb-2 px-4">
        <input
          type="text"
          placeholder="Search Message"
          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#F3F3F3]"
        />
      </div>

      {/* Chat Room List */}
      <div className="flex-1 overflow-y-auto custom-scroll">
        {rooms.map((room) => {
          const isSelected = selectedId === room.chat_room_id;
          const formattedTime = room?.last_updated
            ? new Date(room.last_updated).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "";

          return (
            <div
              key={room.chat_room_id}
              onClick={() => setSelectedId(room.chat_room_id)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all rounded-xl m-2 ${
                isSelected ? "bg-[#E8F8FF]" : "hover:bg-gray-50"
              }`}
            >
              {/* User Avatar */}
              <img
                src={room.user?.url || userImg}
                alt="User"
                className="w-10 h-10 object-cover rounded-full"
              />

              {/* User Info */}
              <div className="flex-1">
                <div className="font-medium text-sm truncate">
                  {room.user?.name || "Unknown User"}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {room.lastMessage || ""}
                </div>
              </div>

              {/* Timestamp */}
              <div className="text-xs text-gray-400 pl-2 min-w-[60px] text-right">
                {formattedTime}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MessageList;
