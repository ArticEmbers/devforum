// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot, query } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAUJtKUZtF9hjC3-QZv0_Bf6DltMNVJDhc",
    authDomain: "devforum-2e7e9.firebaseapp.com",
    projectId: "devforum-2e7e9",
    storageBucket: "devforum-2e7e9.appspot.com",
    messagingSenderId: "611187822619",
    appId: "1:611187822619:web:1543599b010ad2b970a8be",
    measurementId: "G-FJ7Z517V4R"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// POSTS
export const postsCollection = collection(db, "posts");

export const addPost = async (author, content) => {
    await addDoc(postsCollection, { author, content, timestamp: Date.now() });
};

export const deletePost = async (id) => {
    await deleteDoc(doc(db, "posts", id));
};

export const subscribeToPosts = (callback) => {
    const q = query(postsCollection);
    return onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(data);
    });
};

// ACTIVE MEMBERS
export const activeMembersCollection = collection(db, "activeMembers");

export const addActiveMember = async (username, role) => {
    const docRef = doc(activeMembersCollection, username);
    await addDoc(docRef, { username, role });
};

export const removeActiveMember = async (username) => {
    const docRef = doc(db, "activeMembers", username);
    await deleteDoc(docRef);
};

export const subscribeToActiveMembers = (callback) => {
    return onSnapshot(activeMembersCollection, (snapshot) => {
        const data = snapshot.docs.map(doc => doc.data());
        callback(data);
    });
};
