import React, { useState, useEffect } from "react";
import { db, collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from "./firebase";
import ActiveMembers from "./components/ActiveMembers";
import NewPost from "./components/NewPost";
import Posts from "./components/Posts";
import "./App.css";

export default function App() {
    const users = [
        { username: "Luna", password: "Endurance:2008/Rapido.", role: "admin" },
        { username: "Amy", password: "fyjhym-vorxU2-sarnuz", role: "member" },
    ];

    const [currentUser, setCurrentUser] = useState(
        () => localStorage.getItem("currentUser") || null
    );
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

    // Add current user to active members
    useEffect(() => {
        if (currentUser) {
            const user = users.find(u => u.username === currentUser);
            if (user) {
                setMembersList((prev) => {
                    if (!prev.some((m) => m.username === user.username)) {
                        return [...prev, { username: user.username, role: user.role }];
                    }
                    return prev;
                });
            }
        }
    }, [currentUser]);

    const handleLogin = (e) => {
        e.preventDefault();
        const user = users.find((u) => u.password === passwordInput);
        if (user) {
            setCurrentUser(user.username);
            localStorage.setItem("currentUser", user.username); // persist login
            setPasswordInput("");
            setError("");
        } else {
            setError("Invalid password");
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem("currentUser");
    };

    const addPost = async (content) => {
        if (!currentUser) return;
        await addDoc(collection(db, "posts"), {
            author: currentUser,
            content,
            createdAt: serverTimestamp(),
        });
    };

    const deletePost = async (id, author) => {
        if (currentUser === "Luna" || currentUser === author) {
            await deleteDoc(doc(db, "posts", id));
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
