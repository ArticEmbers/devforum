// Import the functions you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyAUJtKUZtF9hjC3-QZv0_Bf6DltMNVJDhc",
    authDomain: "devforum-2e7e9.firebaseapp.com",
    projectId: "devforum-2e7e9",
    storageBucket: "devforum-2e7e9.firebasestorage.app",
    messagingSenderId: "611187822619",
    appId: "1:611187822619:web:1543599b010ad2b970a8be",
    measurementId: "G-FJ7Z517V4R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore and export it
export const db = getFirestore(app);
