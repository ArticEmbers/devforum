import React, { useState, useEffect } from "react";
import ActiveMembers from "./components/ActiveMembers";
import NewPost from "./components/NewPost";
import Posts from "./components/Posts";
import "./App.css";
import { db } from "./firebase";
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, setDoc, deleteDoc as deleteFirestoreDoc } from "firebase/firestore";

const App = () => {
    const [posts, setPosts] = useState([]);
    const [members, setMembers] = useState([]);
    const [currentUser, setCurrentUser] = useState({ username: "Luna", role: "admin" });

    const membersCollection = collection(db, "activeMembers");

    useEffect(() => {
        // Add current user to activeMembers on mount
        const addCurrentUser = async () => {
            await setDoc(doc(membersCollection, currentUser.username), currentUser);
        };
        addCurrentUser();

        // Load posts in real-time
        const postsQuery = query(collection(db, "posts"), orderBy("timestamp", "desc"));
        const unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
            setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        // Load active members in real-time
        const unsubscribeMembers = onSnapshot(membersCollection, snapshot => {
            setMembers(snapshot.docs.map(doc => doc.data()));
        });

        return () => {
            unsubscribePosts();
            unsubscribeMembers();
            // Remove current user from activeMembers on unmount
            deleteFirestoreDoc(doc(membersCollection, currentUser.username));
        };
    }, []);

    const handleAddPost = async (content) => {
        await addDoc(collection(db, "posts"), {
            author: currentUser.username,
            role: currentUser.role,
            content,
            timestamp: Date.now()
        });
    };

    const handleDeletePost = async (postId) => {
        await deleteDoc(doc(db, "posts", postId));
    };

    const handleLogout = async () => {
        await deleteFirestoreDoc(doc(membersCollection, currentUser.username));
        setCurrentUser(null); // or redirect to login page
    };

    if (!currentUser) return <p>Please log in.</p>;

    return (
        <div className="app-container">
            <header>
                DevForum
                <button className="logout" onClick={handleLogout}>Logout</button>
            </header>
            <ActiveMembers members={members} />
            <NewPost currentUser={currentUser} onAddPost={handleAddPost} />
            <Posts posts={posts} currentUser={currentUser} onDelete={handleDeletePost} />
        </div>
    );
};

export default App;
