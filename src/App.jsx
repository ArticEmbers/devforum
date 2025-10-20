import React, { useState, useEffect } from "react";
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";
import NewPost from "./components/NewPost";
import Posts from "./components/Posts";
import ActiveMembers from "./components/ActiveMembers";
import "./App.css";

// Hardcoded users
const users = [
    { username: "Luna", password: "Endurance:2008/Rapido.", role: "admin" },
    { username: "Amy", password: "fyjhym-vorxU2-sarnuz", role: "member" }
];

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [posts, setPosts] = useState([]);

    // Fetch posts live from Firestore
    useEffect(() => {
        const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    const login = (username, password) => {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) setCurrentUser(user);
        else alert("Invalid credentials");
    };

    const logout = () => setCurrentUser(null);

    const addPost = async (content) => {
        if (!currentUser) return;
        await addDoc(collection(db, "posts"), {
            username: currentUser.username,
            content,
            role: currentUser.role,
            timestamp: new Date()
        });
    };

    const removePost = async (id, postUser) => {
        if (!currentUser) return;
        if (currentUser.role === "admin" || currentUser.username === postUser) {
            await deleteDoc(doc(db, "posts", id));
        } else {
            alert("You can't delete this post!");
        }
    };

    if (!currentUser) {
        return (
            <div className="login-container">
                <h1>Login</h1>
                <LoginForm login={login} />
            </div>
        );
    }

    return (
        <div className="app-container">
            <header>
                <h1>DevForum</h1>
                <button className="logout-btn" onClick={logout}>Logout</button>
            </header>
            <ActiveMembers currentUser={currentUser} />
            <NewPost onAdd={addPost} />
            <Posts posts={posts} currentUser={currentUser} onDelete={removePost} />
        </div>
    );
}

// Simple login form
function LoginForm({ login }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    return (
        <div className="login-form">
            <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
            <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <button onClick={() => login(username, password)}>Login</button>
        </div>
    );
}

export default App;
