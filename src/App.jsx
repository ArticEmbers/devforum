import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./components/Post";
import ActiveMembers from "./components/ActiveMembers";
import NewPost from "./components/NewPost";
import { db, collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy } from "./firebase";

export default function App() {
    // Dummy authentication
    const [currentUser, setCurrentUser] = useState({ username: "Luna", password: "Endurance:2008/Rapido.", rank: "Admin" });

    // Posts
    const [posts, setPosts] = useState([]);

    // Active members
    const [members, setMembers] = useState([{ username: currentUser.username, rank: currentUser.rank }]);

    useEffect(() => {
        const postsRef = collection(db, "posts");
        const q = query(postsRef, orderBy("timestamp", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPosts(postsData);
        });
        return () => unsubscribe();
    }, []);

    const handleAddPost = async (content) => {
        if (!content) return;
        await addDoc(collection(db, "posts"), {
            content,
            username: currentUser.username,
            rank: currentUser.rank,
            timestamp: new Date()
        });
    };

    const handleDeletePost = async (id) => {
        const postDoc = doc(db, "posts", id);
        await deleteDoc(postDoc);
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setMembers([]);
    };

    return (
        <div className="app-container">
            <header>
                <h1>DevForum</h1>
                {currentUser && (
                    <button className="logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                )}
            </header>

            {currentUser ? (
                <div className="main-content">
                    <aside>
                        <ActiveMembers members={members} />
                    </aside>
                    <section className="forum-section">
                        <NewPost onAdd={handleAddPost} />
                        <div className="posts-container">
                            {posts.map((post) => (
                                <Post
                                    key={post.id}
                                    post={post}
                                    onDelete={handleDeletePost}
                                    isCurrentUser={post.username === currentUser.username}
                                />
                            ))}
                        </div>
                    </section>
                </div>
            ) : (
                <div className="login-placeholder">
                    <p>Please log in to see posts.</p>
                </div>
            )}
        </div>
    );
}
