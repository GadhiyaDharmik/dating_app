import React, { useEffect, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import AgoraRTM from "agora-rtm-sdk";
import axiosInspector from "../../http/axiosMain";

const APP_ID = "cb8359241f474aca9597df671df45af1";
const BACKEND_API = "/rtc_token";
const RTM_TOKEN_API = "/rtm_token";

const VoiceCallComponent = ({ userId, peerId }) => {
  const [client] = useState(() =>
    AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })
  );
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [joined, setJoined] = useState(false);
  const [rtmClient, setRtmClient] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [callStatus, setCallStatus] = useState("idle"); // idle, calling, connecting, in-call

  // Generate deterministic channel name
  const generateChannelName = (userId1, userId2) => {
    const sortedIds = [userId1, userId2].sort();
    return `${sortedIds[0]}_${sortedIds[1]}`;
  };

  const channelName = peerId ? generateChannelName(userId, peerId) : null;

  const validateUID = (uid) => {
    if (typeof uid === "string" && (uid.length < 1 || uid.length > 255)) {
      alert("UID string length must be between 1 and 255 characters");
      return false;
    }
    return true;
  };

  const fetchRTMToken = async (uid) => {
    try {
      console.log("Fetching RTM token for UID:", uid);
      const response = await axiosInspector.get(`${RTM_TOKEN_API}?user_id=${uid}`);
      const rtmToken = response?.data?.token;
      if (!rtmToken) {
        throw new Error("No RTM token received from backend");
      }
      console.log("Received RTM Token:", rtmToken);
      return rtmToken;
    } catch (error) {
      console.error("❌ Error fetching RTM token:", error);
      throw error;
    }
  };

  const fetchRTCToken = async (uid, channel) => {
    try {
      console.log("Fetching RTC token for UID:", uid, "Channel:", channel);
      const response = await axiosInspector.get(
        `${BACKEND_API}?user_id=${uid}&channel_name=${channel}`
      );
      const rtcToken = response?.data?.token;
      if (!rtcToken) {
        throw new Error("No RTC token received from backend");
      }
      console.log("Received RTC Token:", rtcToken);
      return rtcToken;
    } catch (error) {
      console.error("❌ Error fetching RTC token:", error);
      throw error;
    }
  };

  useEffect(() => {
    let isUnmounted = false;

    const initRTM = async (retries = 3, delay = 5000) => {
      for (let attempt = 1; attempt <= retries; attempt++) {
        if (isUnmounted) return;
        try {
          const rtmToken = await fetchRTMToken(userId);
          const rtm = new AgoraRTM.RTM(APP_ID, userId);
          await rtm.login({ token: rtmToken });
          console.log("✅ RTM login success");

          if (isUnmounted) {
            rtm.logout();
            return;
          }

          setRtmClient(rtm);

          rtm.on("MessageFromPeer", ({ text }, senderId) => {
            console.log("📩 Peer message from", senderId, ":", text);
            try {
              const payload = JSON.parse(text);
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
                  setCallStatus("idle");
                  alert("Call declined by recipient");
                  client.leave();
                } else if (payload.status === "ended") {
                  setCallStatus("idle");
                  client.leave();
                  setJoined(false);
                }
              }
            } catch (err) {
              console.error("Failed to parse peer message:", err);
            }
          });

          rtm.on("ConnectionStateChanged", (newState, reason) => {
            console.log(`Connection state changed to ${newState}, reason: ${reason}`);
            if (reason === "REMOTE_LOGIN") {
              alert("You have been logged out due to another session login.");
              setRtmClient(null);
            }
          });

          return;
        } catch (err) {
          console.error(`❌ RTM Login failed (attempt ${attempt}/${retries}):`, err);
          if (attempt === retries) {
            alert("Failed to initialize RTM service. Please try again later.");
            throw err;
          }
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    };

    if (userId && validateUID(userId)) initRTM();

    return () => {
      isUnmounted = true;
      if (rtmClient) rtmClient.logout();
    };
  }, [userId]);

  const joinVoiceCall = async (channel) => {
    try {
      if (!validateUID(userId)) return;

      if (client.connectionState === "CONNECTED" || client.connectionState === "CONNECTING") {
        console.warn("Already connected or connecting.");
        return;
      }

      const token = await fetchRTCToken(userId, channel);
      await client.join(APP_ID, channel, token, userId);

      const micTrack = await AgoraRTC.createMicrophoneAudioTrack();
      await client.publish([micTrack]);
      setLocalAudioTrack(micTrack);
      setJoined(true);
      setCallStatus("in-call");

      client.on("user-joined", (user) => {
        console.log("User joined:", user.uid);
        setCallStatus("in-call");
      });

      client.on("user-left", (user, reason) => {
        console.log("User left:", user.uid, "Reason:", reason);
        setCallStatus("idle");
        setJoined(false);
      });
    } catch (err) {
      console.error("Join error:", err);
      alert(err.message);
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
      console.log("👋 Left the voice call.");

      if (rtmClient && peerId) {
        const endMessage = {
          type: "call_status_update",
          status: "ended",
          ender_id: userId,
          channel_name: channelName,
        };
        await rtmClient.sendMessageToPeer({ text: JSON.stringify(endMessage) }, peerId);
      }
    } catch (err) {
      console.error("Leave error:", err);
    }
  };

  const callUser = async () => {
    if (!peerId) {
      alert("Peer ID missing.");
      return;
    }

    if (!rtmClient) {
      alert("RTM not initialized yet. Please wait a moment.");
      return;
    }

    if (rtmClient.connectionState !== "CONNECTED") {
      alert("RTM client is not connected. Please try again later.");
      return;
    }

    try {
      const onlineStatus = await rtmClient.queryPeersOnlineStatus([peerId]);
      if (!onlineStatus[peerId]) {
        alert("The user you are trying to call is not online.");
        return;
      }

      const callPayload = {
        type: "call_invitation",
        caller_id: userId,
        caller_name: userId === "94e0555c-f4ad-4277-8a3c-99170844e542" ? "Ronak" : "Sanket",
        channel_name: channelName,
        call_type: "voice",
      };

      await rtmClient.sendMessageToPeer({ text: JSON.stringify(callPayload) }, peerId);
      setCallStatus("calling");
      joinVoiceCall(channelName);
      alert("📞 Call invitation sent.");
    } catch (err) {
      console.error("Failed to send call invitation:", err);
      alert("Failed to send call invitation.");
      setCallStatus("idle");
    }
  };

  const acceptCall = async () => {
    if (!incomingCall) return;
    try {
      const acceptMessage = {
        type: "call_status_update",
        status: "accepted",
        receiver_id: userId,
        channel_name: incomingCall.channel,
      };
      await rtmClient.sendMessageToPeer(
        { text: JSON.stringify(acceptMessage) },
        incomingCall.caller_id
      );
      await joinVoiceCall(incomingCall.channel);
      setIncomingCall(null);
    } catch (err) {
      console.error("Error accepting call:", err);
      alert("Failed to accept call.");
      setCallStatus("idle");
    }
  };

  const declineCall = async () => {
    if (!incomingCall) return;
    try {
      const declineMessage = {
        type: "call_status_update",
        status: "declined",
        receiver_id: userId,
        channel_name: incomingCall.channel,
      };
      await rtmClient.sendMessageToPeer(
        { text: JSON.stringify(declineMessage) },
        incomingCall.caller_id
      );
      setIncomingCall(null);
      setCallStatus("idle");
    } catch (err) {
      console.error("Error declining call:", err);
    }
  };

  return (
    <div className="p-4 border rounded-md shadow-md max-w-md bg-white">
      <h2 className="font-bold text-lg mb-4">
        Voice Call: {userId === "94e0555c-f4ad-4277-8a3c-99170844e542" ? "Ronak" : "Sanket"}
      </h2>

      {callStatus === "in-call" && (
        <button
          onClick={leaveVoiceCall}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          End Call
        </button>
      )}

      {callStatus === "idle" && (
        <button
          onClick={callUser}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Call {userId === "94e0555c-f4ad-4277-8a3c-99170844e542" ? "Sanket" : "Ronak"}
        </button>
      )}

      {callStatus === "calling" && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <p className="font-semibold">Calling...</p>
          <button
            onClick={leaveVoiceCall}
            className="px-3 py-1 bg-red-500 text-white rounded-md"
          >
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
          <p className="font-semibold">
            Incoming {incomingCall.call_type} call from {incomingCall.from}
          </p>
          <button
            onClick={acceptCall}
            className="px-3 py-1 bg-green-500 text-white rounded-md mr-2"
          >
            Accept
          </button>
          <button
            onClick={declineCall}
            className="px-3 py-1 bg-red-500 text-white rounded-md"
          >
            Decline
          </button>
        </div>
      )}
    </div>
  );
};

export default VoiceCallComponent;