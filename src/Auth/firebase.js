// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your web Firebase config (from the JSON you gave)
const firebaseConfig = {
  apiKey: "AIzaSyBnGxp5ErRizhT_frG7lHkanv3bkM8XYiE",
  authDomain: "loveai-e3be0.firebaseapp.com",
  projectId: "loveai-e3be0",
  storageBucket: "loveai-e3be0.appspot.com",
  messagingSenderId: "736402090832",
  appId: "1:736402090832:web:YOUR_WEB_APP_ID", // optional
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth and Provider
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
