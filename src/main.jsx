import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./mainApp.css";
import AgoraRTC from "agora-rtc-sdk-ng";
import { AgoraRTCProvider } from "agora-rtc-react";
import { AboutProvider } from "./utils/AboutContext.jsx";

const rtcClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AgoraRTCProvider client={rtcClient}>
      <AboutProvider>
        <App />
      </AboutProvider>
      {/* <App /> */}
    </AgoraRTCProvider>
  </StrictMode>
);
