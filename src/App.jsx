import React, { useState, useEffect } from "react";
import ActiveMembers from "./components/ActiveMembers";
import NewPost from "./components/NewPost";
import Posts from "./components/Posts";
import "./App.css";
import { db } from "./firebase"; // your Firestore init
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy } from "firebase/firestore";

const App = () => {
    const [posts, setPosts] = useState([]);
    const [members, setMembers] = useState([]);
    const [currentUser, setCurrentUser] = useState({ username: "Luna", role: "admin" });

    useEffect(() => {
        // Load posts in real-time
        const postsQuery = query(collection(db, "posts"), orderBy("timestamp", "desc"));
        const unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
            const postsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setPosts(postsData);
        });

        // Load active members in real-time
        const membersQuery = collection(db, "activeMembers");
        const unsubscribeMembers = onSnapshot(membersQuery, (snapshot) => {
            const membersData = snapshot.docs.map((doc) => doc.data());
            setMembers(membersData);
        });

        return () => {
            unsubscribePosts();
            unsubscribeMembers();
        };
    }, []);

    const handleAddPost = async (content) => {
        await addDoc(collection(db, "posts"), {
            author: currentUser.username,
            role: currentUser.role,
            content,
            timestamp: Date.now(),
        });
    };

    const handleDeletePost = async (postId) => {
        await deleteDoc(doc(db, "posts", postId));
    };

    return (
        <div className="app-container">
            <header>DevForum</header>
            <ActiveMembers members={members} />
            <NewPost currentUser={currentUser} onAddPost={handleAddPost} />
            <Posts posts={posts} currentUser={currentUser} onDelete={handleDeletePost} />
        </div>
    );
};

export default App;
