import React, { useState, useEffect } from "react";
import { db, collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from "./firebase";
import ActiveMembers from "./components/ActiveMembers";
import NewPost from "./components/NewPost";
import Posts from "./components/Posts";
import "./App.css";

export default function App() {
    const users = [
        { username: "Luna", password: "Endurance:2008/Rapido.", role: "Administrator" },
        { username: "Amy", password: "Friend1Pass", role: "Member" },
        { username: "Friend2", password: "Friend2Pass", role: "member" },
    ];

    const [currentUser, setCurrentUser] = useState(null);
    const [passwordInput, setPasswordInput] = useState("");
    const [error, setError] = useState("");
    const [posts, setPosts] = useState([]);
    const [membersList, setMembersList] = useState([]);

    // Listen to posts in Firestore
    useEffect(() => {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    // Login handler
    const handleLogin = (e) => {
        e.preventDefault();
        const user = users.find((u) => u.password === passwordInput);
        if (user) {
            setCurrentUser(user.username);
            setPasswordInput("");
            setError("");

            // Add to active members
            setMembersList((prev) => {
                if (!prev.some((m) => m.username === user.username)) {
                    return [...prev, { username: user.username, role: user.role }];
                }
                return prev;
            });
        } else {
            setError("Invalid password");
        }
    };

    // Add post to Firestore
    const addPost = async (content) => {
        if (!currentUser) return;
        await addDoc(collection(db, "posts"), {
            author: currentUser,
            content,
            createdAt: serverTimestamp(), // Firestore timestamp
        });
    };

    // Delete post
    const deletePost = async (id, author) => {
        if (currentUser === "ArticEmbers" || currentUser === author) {
            await deleteDoc(doc(db, "posts", id));
        } else {
            alert("You can only delete your own posts!");
        }
    };

    return (
        <div className="app">
            <header>
                <h1>DevForum</h1>
            </header>

            {!currentUser ? (
                <form onSubmit={handleLogin} className="login-form">
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                    />
                    <button type="submit">Login</button>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </form>
            ) : (
                <p style={{ textAlign: "center", marginBottom: "10px" }}>
                    Logged in as <strong>{currentUser}</strong>
                </p>
            )}

            <ActiveMembers members={membersList} />

            {currentUser && <NewPost addPost={addPost} />}

            {currentUser && (
                <Posts
                    posts={posts}
                    deletePost={deletePost}
                    currentUser={currentUser}
                />
            )}
        </div>
    );
}
