import React, { useState, useEffect } from "react";
import { db, collection, onSnapshot, query, orderBy, addDoc, deleteDoc, doc, serverTimestamp } from "./firebase";
import NewPost from "./components/NewPost";
import Posts from "./components/Posts";
import "./App.css";

function App() {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState({ username: "", password: "" });
    const [loggedIn, setLoggedIn] = useState(false);

    const USERS = {
        Luna: "Endurance:2008/Rapido.",
        Amy: "fyjhym-vorxU2-sarnuz"
    };

    const handleLogin = (username, password) => {
        if (USERS[username] && USERS[username] === password) {
            setUser({ username });
            setLoggedIn(true);
        } else {
            alert("Wrong username or password!");
        }
    };

    const handleLogout = () => {
        setLoggedIn(false);
        setUser({ username: "", password: "" });
    };

    useEffect(() => {
        const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    const handleAddPost = async (text) => {
        const newPost = {
            username: user.username,
            text,
            timestamp: serverTimestamp()
        };
        await addDoc(collection(db, "posts"), newPost);
    };

    const handleDeletePost = async (postId, postUser) => {
        if (postUser === user.username) {
            await deleteDoc(doc(db, "posts", postId));
        } else {
            alert("You can only delete your own posts!");
        }
    };

    if (!loggedIn) {
        return (
            <div className="login-container">
                <h2>Login</h2>
                <input placeholder="Username" id="username" />
                <input placeholder="Password" type="password" id="password" />
                <button onClick={() => handleLogin(
                    document.getElementById("username").value,
                    document.getElementById("password").value
                )}>Login</button>
            </div>
        );
    }

    return (
        <div className="app-container">
            <header>
                <h1>DevForum</h1>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </header>
            <NewPost onAdd={handleAddPost} />
            <div className="posts-container">
                {posts.length ? posts.map(post => (
                    <Posts key={post.id} post={post} currentUser={user.username} onDelete={handleDeletePost} />
                )) : <p>No posts yet</p>}
            </div>
        </div>
    );
}

export default App;
