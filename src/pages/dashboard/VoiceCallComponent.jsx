import React, { useState, useEffect } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import AgoraRTM from "agora-rtm-sdk";
import axiosInspector from "../../http/axiosMain";

const APP_ID = "cb8359241f474aca9597df671df45af1";
const BACKEND_API = "/rtc_token";
const BACKEND_API_RTM = "/rtm_token";

const VoiceCallComponent = ({ userId, peerId }) => {
  const [client] = useState(() => AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }));
  const [localTracks, setLocalTracks] = useState([]);
  const [joined, setJoined] = useState(false);
  const [rtmClient, setRtmClient] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [showCallingModal, setShowCallingModal] = useState(false);
  const CHANNEL_NAME = peerId;

  const { RTM } = AgoraRTM;
  const fetchRTMToken = async () => {
    const response = await axiosInspector.post(BACKEND_API_RTM, {
      uid: userId,
      expireTime: 3600,
      // channelName: CHANNEL_NAME,
    });
    return response?.data?.token;
  };


  const initRTM = async () => {
    // const rtm = new RTM(appId, userId);

    const token = await fetchRTMToken();
    if (!token) {
      alert("RTM Token fetch failed.");
      return;
    }

    const client = new RTM("cb8359241f474aca9597df671df45af1", "10");
    await client.login({ uid: userId, token });


    // client.on("MessageFromPeer", async (message, peerId) => {
    //   const data = JSON.parse(message.text);
    //   console.log("📩 RTM Message:", data);

    //   if (data.type === "call_invitation") {
    //     setIncomingCall({ from: peerId, channel: data.channelName });
    //   } else if (data.type === "call_status" && data.status === "ended") {
    //     leaveCall();
    //   }
    // });

    setRtmClient(client);
  };

  const fetchRTCToken = async () => {
    const response = await axiosInspector.post(BACKEND_API, {
      uid: userId,
      expireTime: 3600,
      channelName: CHANNEL_NAME,
    });
    return response?.data?.token;
  };

  const joinCall = async () => {
    const token = await fetchRTCToken();
    if (!token) {
      alert("Token fetch failed.");
      return;
    }

    try {
      await client.join(APP_ID, CHANNEL_NAME, token, userId);
      const [micTrack, camTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      await client.publish([micTrack, camTrack]);
      const localVideo = document.getElementById("local-video");
      camTrack.play(localVideo);
      setLocalTracks([micTrack, camTrack]);
      setJoined(true);

      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === "video") {
          const remoteContainer = document.createElement("div");
          remoteContainer.id = user.uid;
          remoteContainer.style.width = "100%";
          remoteContainer.style.height = "300px";
          document.getElementById("remote-videos").appendChild(remoteContainer);
          user.videoTrack.play(remoteContainer);
        }
        if (mediaType === "audio") {
          user.audioTrack.play();
        }
      });

      client.on("user-unpublished", (user, mediaType) => {
        if (mediaType === "video") {
          const remoteContainer = document.getElementById(user.uid);
          if (remoteContainer) remoteContainer.remove();
        }
      });

    } catch (err) {
      console.error("Join error:", err);
    }
  };

  const leaveCall = async () => {
    for (const track of localTracks) {
      track.stop();
      track.close();
    }
    await client.leave();
    setLocalTracks([]);
    setJoined(false);
    document.getElementById("remote-videos").innerHTML = "";

    if (rtmClient && peerId) {
      await rtmClient.sendMessageToPeer(
        { text: JSON.stringify({ type: "call_status", status: "ended" }) },
        peerId
      );
    }
  };

  const sendCallInvitation = async () => {
    if (!rtmClient || !peerId) return;
    const payload = {
      type: "audio",
      channelName: CHANNEL_NAME,
      callerId: userId,
    };
    await rtmClient.sendMessageToPeer({ text: JSON.stringify(payload) }, peerId);
    setShowCallingModal(true);
  };

  const handleAcceptCall = async () => {
    setShowCallingModal(false);
    await joinCall();
    if (rtmClient && peerId) {
      await rtmClient.sendMessageToPeer(
        { text: JSON.stringify({ type: "call_status", status: "accepted" }) },
        peerId
      );
    }
  };

  const handleDeclineCall = () => {
    setShowCallingModal(false);
  };

  const acceptCall = async () => {
    setIncomingCall(null);
    await joinCall();
    if (rtmClient) {
      await rtmClient.sendMessageToPeer(
        { text: JSON.stringify({ type: "call_status", status: "accepted" }) },
        incomingCall.from
      );
    }
  };

  const declineCall = async () => {
    if (rtmClient) {
      await rtmClient.sendMessageToPeer(
        { text: JSON.stringify({ type: "call_status", status: "declined" }) },
        incomingCall.from
      );
    }
    setIncomingCall(null);
  };

  useEffect(() => {
    if (userId) initRTM();
    return () => {
      rtmClient?.logout();
    };
  }, []);

  return (
    <div className="p-4 border rounded-md shadow-md max-w-md bg-white">
      <h2 className="font-bold text-lg mb-4">Agora RTC Video Call - {userId}</h2>
      <div id="local-video" style={{ width: "100%", height: "300px", backgroundColor: "#000" }} />
      <div id="remote-videos" className="mt-4" />

      {!joined ? (
        <>
          <button
            onClick={sendCallInvitation}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
          >
            Start Call
          </button>

          {showCallingModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-md shadow-lg text-center">
                <h3 className="text-lg font-semibold mb-2">Calling {peerId}...</h3>
                <div className="flex justify-center space-x-4 mt-4">
                  <button
                    onClick={handleAcceptCall}
                    className="px-4 py-2 bg-green-600 text-white rounded"
                  >
                    📞 Call Up
                  </button>
                  <button
                    onClick={handleDeclineCall}
                    className="px-4 py-2 bg-red-600 text-white rounded"
                  >
                    ❌ Call Down
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <button onClick={leaveCall} className="mt-4 px-4 py-2 bg-red-600 text-white rounded">
          Leave Call
        </button>
      )}

      {incomingCall && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-md">
            <h3>📞 Incoming Call from {incomingCall.from}</h3>
            <div className="mt-4 space-x-3">
              <button onClick={acceptCall} className="bg-green-600 px-4 py-2 text-white rounded">Accept</button>
              <button onClick={declineCall} className="bg-red-600 px-4 py-2 text-white rounded">Decline</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceCallComponent;
