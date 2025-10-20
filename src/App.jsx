import React, { useState, useEffect } from "react";
import ActiveMembers from "./components/ActiveMembers";
import NewPost from "./components/NewPost";
import Posts from "./components/Posts";
import "./App.css";

export default function App() {
    // Define members
    const membersList = [
        { username: "ArticEmbers", role: "admin" },
        { username: "Friend1", role: "member" },
        { username: "Friend2", role: "member" },
    ];

    const [currentUser, setCurrentUser] = useState("ArticEmbers");
    const [posts, setPosts] = useState([]);

    // Load posts from localStorage
    useEffect(() => {
        const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];
        setPosts(savedPosts);
    }, []);

    // Save posts to localStorage
    useEffect(() => {
        localStorage.setItem("posts", JSON.stringify(posts));
    }, [posts]);

    const addPost = (content) => {
        const newPost = {
            id: Date.now(),
            author: currentUser,
            content,
        };
        setPosts([newPost, ...posts]);
    };

    const deletePost = (id) => {
        setPosts(posts.filter((post) => post.id !== id));
    };

    return (
        <div className="app">
            <header>
                <h1>DevForum</h1>
            </header>

            {/* User selector */}
            <div className="user-select">
                <label>
                    Current User:{" "}
                    <select
                        value={currentUser}
                        onChange={(e) => setCurrentUser(e.target.value)}
                    >
                        {membersList.map((user) => (
                            <option key={user.username} value={user.username}>
                                {user.username}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <ActiveMembers members={membersList} />
            <NewPost addPost={addPost} />
            <Posts posts={posts} deletePost={deletePost} currentUser={currentUser} />
        </div>
    );
}
