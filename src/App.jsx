import React, { useState, useEffect } from "react";
import ActiveMembers from "./components/ActiveMembers";
import NewPost from "./components/NewPost";
import Posts from "./components/Posts";
import "./App.css";

export default function App() {
    const users = [
        { username: "ArticEmbers", password: "ArticEmbers123", role: "admin" },
        { username: "Friend1", password: "Friend1Pass", role: "member" },
        { username: "Friend2", password: "Friend2Pass", role: "member" },
    ];

    const [currentUser, setCurrentUser] = useState(null);
    const [passwordInput, setPasswordInput] = useState("");
    const [error, setError] = useState("");
    const [posts, setPosts] = useState([]);
    const [membersList, setMembersList] = useState([]);

    // Load posts from localStorage
    useEffect(() => {
        const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];
        setPosts(savedPosts);
    }, []);

    // Save posts to localStorage
    useEffect(() => {
        localStorage.setItem("posts", JSON.stringify(posts));
    }, [posts]);

    // Login
    const handleLogin = (e) => {
        e.preventDefault();
        const user = users.find((u) => u.password === passwordInput);
        if (user) {
            setCurrentUser(user.username);
            setPasswordInput("");
            setError("");

            // Add to active members if not already there
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

    // Add new post
    const addPost = (content) => {
        if (!currentUser) return;
        const newPost = {
            id: Date.now(),
            author: currentUser,
            content,
        };
        setPosts([newPost, ...posts]);
    };

    // Delete post (admin any, user own)
    const deletePost = (id) => {
        const post = posts.find((p) => p.id === id);
        if (!post) return;

        if (currentUser === "ArticEmbers" || post.author === currentUser) {
            setPosts(posts.filter((p) => p.id !== id));
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
