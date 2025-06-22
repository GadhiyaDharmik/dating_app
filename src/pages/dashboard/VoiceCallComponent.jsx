import React, { useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import axiosInspector from "../../http/axiosMain";

const APP_ID = "cb8359241f474aca9597df671df45af1";
const CHANNEL_NAME = "test";

const userTokens = {
  "user1": "007eJxTYPjwuuXDqZ+3BR994I1VNd9ivvf9wgDGf8+K//k6VXhs5N+swJCcZGFsamlkYphmYm6SmJxoaWppnpJmZm6YkmZimphmeLQnLKMhkJHhLd9tZkYGCATxWRhKUotLGBgASvMimw==",
  "user2": "007eJxTYHDpzry2qP3gs40r1kt928Et+sSnNag07+oHpmPz2NWTbZ4oMCQnWRibWhqZGKaZmJskJidamlqap6SZmRumpJmYJqYZMvWGZTQEMjKw87SzMjJAIIjPwlCSWlzCwAAAgqke/Q=="
};

const BACKEND_API = "https://2af8-103-240-204-134.ngrok-free.app/rtc_token";
const RTM_TOKEN_API = "/rtm_token";

const VoiceCallComponent = ({ userId, peerId }) => {
  const [client] = useState(() => AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }));
  const [localTracks, setLocalTracks] = useState([]);
  const [joined, setJoined] = useState(false);


  const fetchRTCToken = async () => {
    const response = await axiosInspector.post(BACKEND_API, {
      uid: userId === "bfe1b897-0015-409a-a763-cc157c87313b" ? "1" : "2",
      expireTime: 3600,
      channelName: "test",
    });
    return response?.data?.token;
  };


  const joinCall = async () => {
    const token = await fetchRTCToken();
    // const token = userTokens[userId === "bfe1b897-0015-409a-a763-cc157c87313b" ? "user1" : "user2"]; // Fallback to user1 token if not found
    console.log("Fetched token:", token);

    if (!token) {
      alert("Invalid user or token not found.");
      return;
    }

    try {
      await client.join(APP_ID, CHANNEL_NAME, token, userId === "bfe1b897-0015-409a-a763-cc157c87313b" ? "1" : "2");

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
  };

  return (
    <div className="p-4 border rounded-md shadow-md max-w-md bg-white">
      <h2 className="font-bold text-lg mb-4">Agora RTC Video Call - {userId}</h2>

      <div id="local-video" style={{ width: "100%", height: "300px", backgroundColor: "#000" }} />
      <div id="remote-videos" className="mt-4" />

      {!joined ? (
        <button onClick={joinCall} className="mt-4 px-4 py-2 bg-green-600 text-white rounded">
          Join Call
        </button>
      ) : (
        <button onClick={leaveCall} className="mt-4 px-4 py-2 bg-red-600 text-white rounded">
          Leave Call
        </button>
      )}
    </div>
  );
};

export default VoiceCallComponent;
