import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./mainApp.css";
import AgoraRTC from "agora-rtc-sdk-ng";
import { AgoraRTCProvider } from "agora-rtc-react";

const rtcClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AgoraRTCProvider client={rtcClient}>
      <App />
    </AgoraRTCProvider>
  </StrictMode>
);
