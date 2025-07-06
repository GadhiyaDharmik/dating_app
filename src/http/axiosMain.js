// src/utils/axiosInspector.js
import axios from "axios";

const axiosInspector = axios.create({
  baseURL: "https://loveai-api.vrajtechnosys.in",
  // baseURL: "http://13.201.224.164:4444/",
  headers: {
    "Content-Type": "application/json",
    
  },
    // withCredentials: true, // ✅ This allows sending cookies or auth credentials
});

// Request interceptor
// Request interceptor
axiosInspector.interceptors.request.use(
  (config) => {
    const token =
      JSON.parse(localStorage.getItem("user_Data"))?.token ||
      localStorage.getItem("authToken"); // Or get from cookie, sessionStorage, etc.

    if (token) {
      //   config.headers.Authorization = `Bearer ${token}`;
      config.headers["token"] = token; // ✅ Use 'token' instead of 'Authorization'
    }

    console.groupCollapsed(
      `%c→ [${config.method.toUpperCase()}] ${config.baseURL}${config.url}`,
      "color: #00aaff; font-weight: bold;"
    );
    console.log("Headers:", config.headers);
    console.log("Payload:", config.data);
    console.groupEnd();

    return config;
  },
  (error) => {
    console.error("⛔ [Request Error]", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInspector.interceptors.response.use(
  (response) => {
    console.groupCollapsed(
      `%c← [${response.status}] ${response.config.baseURL}${response.config.url}`,
      "color: #22aa22; font-weight: bold;"
    );
    console.log("Data:", response.data);
    console.groupEnd();
    return response;
  },
  (error) => {
    if (error.response) {
      console.groupCollapsed(
        `%c✖ [${error.response.status}] ${error.config.baseURL}${error.config.url}`,
        "color: #ff4444; font-weight: bold;"
      );
      console.error("Error Data:", error.response.data);
      console.error("Headers:", error.response.headers);
      console.groupEnd();
    } else {
      console.error("✖ [Network/Error]", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInspector;
