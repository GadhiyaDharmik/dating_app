
const MessageList = ({ rooms, selectedId, setSelectedId, setResiverDetail }) => {
   return (
     <div className="w-80 bg-white border-r border-gray-200 h-screen flex flex-col">
  <div className="p-4 font-semibold text-lg">Messages</div>

  <div className="flex justify-center pb-2 px-4">
    <input
      type="text"
      placeholder="Search Message"
      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#F3F3F3]"
    />
  </div>

  {/* Scrollable area */}
  <div className="flex-1 overflow-y-auto custom-scroll">
    {rooms.map((room) => (
      <div
        key={room.chat_room_id}
        onClick={() => {
          setResiverDetail(room);
          setSelectedId(room.chat_room_id);
        }}
        className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all rounded-xl m-2 ${
          selectedId === room.chat_room_id
            ? "bg-[#E8F8FF]"
            : "hover:bg-gray-50"
        }`}
      >
        <img
          src={room.user?.url || userImg}
          className="w-10 h-10 object-cover"
        />
        <div className="flex-1">
          <div className="font-medium text-sm">{room.user?.name}</div>
          <div className="text-xs text-gray-500 truncate">
            {room.lastMessage}
          </div>
        </div>
        <div className="text-xs text-gray-400 pl-2 min-w-[60px] text-right">
          {new Date(room?.last_updated).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    ))}
  </div>
</div>

    );
}

export default MessageList