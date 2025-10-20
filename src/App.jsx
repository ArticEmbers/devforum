import React, { useState, useEffect } from "react";
import ActiveMembers from "./components/ActiveMembers";
import NewPost from "./components/NewPost";
import Posts from "./components/Posts";
import { db } from "./firebase";
import {
    collection,
    setDoc,
    doc,
    deleteDoc,
    onSnapshot,
    query,
    orderBy,
    addDoc
} from "firebase/firestore";
import "./App.css";

const users = {
    "Endurance:2008/Rapido.": { username: "Luna", role: "admin" },
    "fyjhym-vorxU2-sarnuz": { username: "Amy", role: "member" }
};

const App = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [members, setMembers] = useState([]);
    const [posts, setPosts] = useState([]);
    const membersCol = collection(db, "activeMembers");
    const postsCol = collection(db, "posts");

    const login = (password) => {
        if (users[password]) setCurrentUser(users[password]);
    };

    useEffect(() => {
        if (!currentUser) return;

        // Add current user to activeMembers
        setDoc(doc(membersCol, currentUser.username), currentUser);

        // Listen to activeMembers
        const unsubscribeMembers = onSnapshot(membersCol, snapshot => {
            setMembers(snapshot.docs.map(doc => doc.data()));
        });

        // Listen to posts
        const postsQuery = query(postsCol, orderBy("timestamp", "desc"));
        const unsubscribePosts = onSnapshot(postsQuery, snapshot => {
            setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => {
            unsubscribeMembers();
            unsubscribePosts();
            deleteDoc(doc(membersCol, currentUser.username));
        };
    }, [currentUser]);

    const handleLogout = () => {
        deleteDoc(doc(membersCol, currentUser.username));
        setCurrentUser(null);
    };

    const handleAddPost = async (content) => {
        await addDoc(postsCol, {
            author: currentUser.username,
            role: currentUser.role,
            content,
            timestamp: Date.now()
        });
    };

    const handleDeletePost = async (id, author) => {
        if (currentUser.username === author) {
            await deleteDoc(doc(postsCol, id));
        }
    };

    if (!currentUser) {
        return (
            <div className="app-container">
                <h2>Login</h2>
                {Object.entries(users).map(([pass, user]) => (
                    <button key={user.username} onClick={() => login(pass)}>
                        {user.username}
                    </button>
                ))}
            </div>
        );
    }

    return (
        <div className="app-container">
            <header>
                DevForum
                <button className="logout" onClick={handleLogout}>Logout</button>
            </header>
            <ActiveMembers members={members} />
            <NewPost onAdd={handleAddPost} />
            <Posts posts={posts} currentUser={currentUser} onDelete={handleDeletePost} />
        </div>
    );
};

export default App;
