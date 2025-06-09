import React, { useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";

const APP_ID = "cb8359241f474aca9597df671df45af1";
const BACKEND_API = "https://b6ad-103-249-234-139.ngrok-free.app/rtc_token";

const VoiceCallComponent = ({ channelName = "test", uid }) => {
  const [client] = useState(() =>
    AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })
  );
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [joined, setJoined] = useState(false);

  const validateUID = (uid) => {
    if (typeof uid === "number" && (uid < 0 || uid > 10000)) {
      alert("UID must be between 0 and 10000");
      return false;
    }
    if (typeof uid === "string" && (uid.length < 1 || uid.length > 255)) {
      alert("UID string length must be between 1 and 255 characters");
      return false;
    }
    return true;
  };

  const joinVoiceCall = async () => {
    try {
      const validUid = uid?.user?.id || uid;
      

      if (!validateUID(validUid)) return;

      if (
        client.connectionState === "CONNECTED" ||
        client.connectionState === "CONNECTING"
      ) {
        console.warn(
          "Already connected or connecting. Preventing duplicate join."
        );
        return;
      }

      console.log("🔐 Fetching token from backend...");
      const res = await fetch(BACKEND_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channelName,
          uid: validUid,
          expireTime: 10000,
        }),
      });

      const data = await res.json();
      const token = data?.rtcToken;
      if (!token) throw new Error("Token not received from backend");

      console.log("📶 Joining Agora channel...");
      await client.join(APP_ID, channelName, token, validUid);

      try {
        const micTrack = await AgoraRTC.createMicrophoneAudioTrack();
        await client.publish([micTrack]);
        setLocalAudioTrack(micTrack);
        console.log("🎤 Microphone audio track published.");
      } catch (micErr) {
        console.warn("❌ Microphone not accessible:", micErr.message);
        alert(
          "Microphone not found or not accessible. You can still stay in the room."
        );
      }

      setJoined(true);
      console.log("✅ Voice call joined.");
    } catch (err) {
      console.error("Failed to join voice call:", err);
      alert(`Failed to join voice call: ${err.message}`);
    }
  };

  const leaveVoiceCall = async () => {
    try {
      if (localAudioTrack) {
        localAudioTrack.stop();
        localAudioTrack.close();
      }
      await client.leave();
      setJoined(false);
      console.log("👋 Left the voice call.");
    } catch (err) {
      console.error("Failed to leave voice call:", err);
    }
  };

  return (
    <div className="p-4 border rounded-md shadow-md max-w-md bg-white">
      <h2 className="font-bold text-lg mb-4">Voice Call Room: {channelName}</h2>

      {joined ? (
        <button
          onClick={leaveVoiceCall}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Leave Call
        </button>
      ) : (
        <button
          onClick={joinVoiceCall}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Join Voice Call
        </button>
      )}
    </div>
  );
};

export default VoiceCallComponent;
