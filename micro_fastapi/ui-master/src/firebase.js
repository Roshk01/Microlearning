// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAL0XQ__njyrqEovvOYvABQqj8funKyqnQ",
  authDomain: "chat-puls.firebaseapp.com",
  projectId: "chat-puls",
  storageBucket: "chat-puls.appspot.com",
  messagingSenderId: "862986308712",
  appId: "1:862986308712:web:ea1e4f9501ba3032667fdd",
  measurementId: "G-WB2PESZ4NY"
};

// Initialize Firebase
 initializeApp(firebaseConfig);
 export const app = initializeApp(firebaseConfig);
