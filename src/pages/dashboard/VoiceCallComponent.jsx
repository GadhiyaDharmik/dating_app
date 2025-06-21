import React, { useEffect, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import AgoraRTM from "agora-rtm-sdk";
import axiosInspector from "../../http/axiosMain";

const APP_ID = "cb8359241f474aca9597df671df45af1";
const BACKEND_API = "/rtc_token";
const RTM_TOKEN_API = "/rtm_token";

const VoiceCallComponent = ({ userId, peerId }) => {
  const [client] = useState(() => AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }));
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [joined, setJoined] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [callStatus, setCallStatus] = useState("idle");
  const [rtmClient, setRtmClient] = useState(null);
  const { RTM } = AgoraRTM;

  const generateChannelName = (userId1, userId2) => {
    return [userId1, userId2].sort().join("_");
  };

  const channelName = peerId ? generateChannelName(userId, peerId) : null;

  const fetchRTMToken = async () => {
    const response = await axiosInspector.post(RTM_TOKEN_API, {
      uid: userId,
    });

    const rtm = new RTM(APP_ID, userId);
    await rtm.login({ token: response?.data?.token });
    // await rtm.subscribe(channelName);
    console.log("✅ RTM login & subscribe successful", rtm);

    rtm.addEventListener("message", (event) => {
      const { message, publisher } = event;
      console.log("📩 Message from", publisher, ":", message);
      try {
        const payload = JSON.parse(message);
        if (payload.type === "call_invitation" && payload.caller_id !== userId) {
          setIncomingCall({
            from: payload.caller_name,
            caller_id: payload.caller_id,
            call_type: payload.call_type,
            channel: payload.channel_name,
          });
          setCallStatus("incoming");
        } else if (payload.type === "call_status_update") {
          if (payload.status === "accepted") {
            setCallStatus("connecting");
          } else if (payload.status === "declined") {
            alert("Call declined");
            setCallStatus("idle");
            client.leave();
          } else if (payload.status === "ended") {
            setCallStatus("idle");
            client.leave();
            setJoined(false);
          }
        }
      } catch (err) {
        console.error("❌ Failed to parse message", err);
      }
    });

    setRtmClient(rtm);
    ;
  };

  const fetchRTCToken = async () => {
    const response = await axiosInspector.post(BACKEND_API, {
      uid: userId,
      expireTime: 3600,
      channelName: channelName || "default_channel",
    });
    return response?.data?.token;
  };

  const initRTM = async () => {
    try {
      const rtmToken = await fetchRTMToken();


    } catch (err) {
      console.error("❌ RTM Init Failed:", err);
    }
  };

  const sendChannelMessage = async (msg) => {
    try {
      await rtmClient.publish(channelName, JSON.stringify(msg));
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  useEffect(() => {
    if (userId && peerId) {
      initRTM().then((rtm) => {
        if (rtm) setRtmClient(rtm);
      });
    }

    return () => {
      rtmClient?.logout().catch(console.warn);
    };
  }, [userId, peerId]);


  const joinVoiceCall = async (channel) => {
    try {
      const token = await fetchRTCToken();
      await client.join(APP_ID, channelName, token, userId);

      const micTrack = await AgoraRTC.createMicrophoneAudioTrack();
      await client.publish([micTrack]);
      setLocalAudioTrack(micTrack);
      setJoined(true);
      setCallStatus("in-call");

      client.on("user-joined", () => setCallStatus("in-call"));
      client.on("user-left", () => {
        setCallStatus("idle");
        setJoined(false);
      });
    } catch (err) {
      console.error("RTC Join Error:", err);
      setCallStatus("idle");
    }
  };

  const leaveVoiceCall = async () => {
    try {
      if (localAudioTrack) {
        localAudioTrack.stop();
        localAudioTrack.close();
        setLocalAudioTrack(null);
      }
      await client.leave();
      setJoined(false);
      setCallStatus("idle");

      if (rtmClient && peerId) {
        await sendChannelMessage({
          type: "call_status_update",
          status: "ended",
          ender_id: userId,
          channel_name: channelName,
        });
      }
    } catch (err) {
      console.error("Leave error:", err);
    }
  };

  const callUser = async () => {
    if (!peerId || !rtmClient) {
      alert("RTM not ready yet. Please wait...");
      return;
    }

    try {
      await sendChannelMessage({
        type: "call_invitation",
        caller_id: userId,
        caller_name: userId === "94e0555c-f4ad-4277-8a3c-99170844e542" ? "Ronak" : "Sanket",
        channel_name: channelName,
        call_type: "voice",
      });

      setCallStatus("calling");
      await joinVoiceCall(channelName);
    } catch (err) {
      console.error("Call failed:", err);
      setCallStatus("idle");
    }
  };

  const acceptCall = async () => {
    if (!incomingCall) return;
    await sendChannelMessage({
      type: "call_status_update",
      status: "accepted",
      receiver_id: userId,
      channel_name: incomingCall.channel,
    });
    await joinVoiceCall(incomingCall.channel);
    setIncomingCall(null);
  };

  const declineCall = async () => {
    if (!incomingCall) return;
    await sendChannelMessage({
      type: "call_status_update",
      status: "declined",
      receiver_id: userId,
      channel_name: incomingCall.channel,
    });
    setIncomingCall(null);
    setCallStatus("idle");
  };

  return (
    <div className="p-4 border rounded-md shadow-md max-w-md bg-white">
      <h2 className="font-bold text-lg mb-4">
        Voice Call: {userId === "94e0555c-f4ad-4277-8a3c-99170844e542" ? "Ronak" : "Sanket"}
      </h2>

      {callStatus === "in-call" && (
        <button onClick={leaveVoiceCall} className="px-4 py-2 bg-red-500 text-white rounded-md">
          End Call
        </button>
      )}

      {callStatus === "idle" && (
        <button onClick={callUser} className="px-4 py-2 bg-blue-600 text-white rounded-md">
          Call {userId === "94e0555c-f4ad-4277-8a3c-99170844e542" ? "Sanket" : "Ronak"}
        </button>
      )}

      {callStatus === "calling" && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <p className="font-semibold">Calling...</p>
          <button onClick={leaveVoiceCall} className="px-3 py-1 bg-red-500 text-white rounded-md">
            Cancel
          </button>
        </div>
      )}

      {callStatus === "connecting" && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <p className="font-semibold">Connecting...</p>
        </div>
      )}

      {incomingCall && callStatus === "incoming" && (
        <div className="mt-4 p-3 border bg-gray-100 rounded-md">
          <p className="font-semibold">Incoming call from {incomingCall.from}</p>
          <button onClick={acceptCall} className="px-3 py-1 bg-green-500 text-white rounded-md mr-2">
            Accept
          </button>
          <button onClick={declineCall} className="px-3 py-1 bg-red-500 text-white rounded-md">
            Decline
          </button>
        </div>
      )}
    </div>
  );
};

export default VoiceCallComponent;
