// src/App.jsx
import React, { useState, useEffect } from "react";
import { addPost, deletePost, subscribeToPosts, addActiveMember, removeActiveMember, subscribeToActiveMembers } from "./firebase";
import NewPost from "./components/NewPost";
import Posts from "./components/Posts";
import ActiveMembers from "./components/ActiveMembers";

export default function App() {
    const users = [
        { username: "Luna", password: "Endurance:2008/Rapido.", role: "admin" },
        { username: "Amy", password: "fyjhym-vorxU2-sarnuz", role: "member" },
    ];

    const [currentUser, setCurrentUser] = useState(null);
    const [passwordInput, setPasswordInput] = useState("");
    const [error, setError] = useState("");
    const [posts, setPosts] = useState([]);
    const [activeMembers, setActiveMembers] = useState([]);

    // Subscribe to posts
    useEffect(() => subscribeToPosts(setPosts), []);

    // Subscribe to active members in real-time
    useEffect(() => subscribeToActiveMembers(setActiveMembers), []);

    // Login
    const handleLogin = async (e) => {
        e.preventDefault();
        const user = users.find(u => u.password === passwordInput);
        if (user) {
            setCurrentUser(user.username);
            setPasswordInput("");
            setError("");
            await addActiveMember(user.username, user.role);
        } else {
            setError("Invalid password");
        }
    };

    // Logout
    const handleLogout = async () => {
        if (currentUser) await removeActiveMember(currentUser);
        setCurrentUser(null);
    };

    const handleAddPost = async (content) => {
        if (!currentUser) return;
        await addPost(currentUser, content);
    };

    const handleDeletePost = async (id, author) => {
        if (currentUser === "Luna" || currentUser === author) {
            await deletePost(id);
        } else {
            alert("You can only delete your own posts!");
        }
    };

    return (
        <div className="app">
            <header>
                <h1>DevForum</h1>
                {currentUser && <button onClick={handleLogout} className="logout-btn">Logout</button>}
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
                <p style={{ textAlign: "center" }}>Logged in as <strong>{currentUser}</strong></p>
            )}

            <ActiveMembers members={activeMembers} />
            {currentUser && <NewPost addPost={handleAddPost} />}
            {currentUser && <Posts posts={posts} deletePost={handleDeletePost} currentUser={currentUser} />}
        </div>
    );
}
