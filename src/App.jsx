import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    orderBy,
} from "firebase/firestore";
import NewPost from "./components/NewPost";
import Post from "./components/Post";

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]); // list of members
    const [posts, setPosts] = useState([]);
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // Load users
    useEffect(() => {
        const usersQuery = collection(db, "activeMembers");
        const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
            const members = snapshot.docs.map((doc) => doc.data());
            setUsers(members);
        });
        return () => unsubscribe();
    }, []);

    // Load posts
    useEffect(() => {
        const postsQuery = query(collection(db, "posts"), orderBy("timestamp", "desc"));
        const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
            const allPosts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setPosts(allPosts);
        });
        return () => unsubscribe();
    }, []);

    const handleLogin = () => {
        const user = users.find(
            (u) => u.username === loginUsername && u.password === loginPassword
        );
        if (user) setCurrentUser(user);
        else alert("Invalid username or password");
    };

    const handleLogout = () => {
        setCurrentUser(null);
    };

    const addPost = async (content) => {
        if (!currentUser) return;
        await addDoc(collection(db, "posts"), {
            author: currentUser.username,
            content,
            timestamp: new Date(),
        });
    };

    const removePost = async (id, author) => {
        if (author !== currentUser?.username) return alert("You can only delete your posts");
        await deleteDoc(doc(db, "posts", id));
    };

    return (
        <div className="app-container">
            {!currentUser ? (
                <div className="login-form">
                    <input
                        placeholder="Username"
                        value={loginUsername}
                        onChange={(e) => setLoginUsername(e.target.value)}
                    />
                    <input
                        placeholder="Password"
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                    />
                    <button onClick={handleLogin}>Login</button>
                </div>
            ) : (
                <>
                    <div className="header">
                        <span>Welcome, {currentUser.username}</span>
                        <button onClick={handleLogout}>Logout</button>
                    </div>

                    <NewPost onAdd={addPost} />

                    <div className="posts-container">
                        {posts.map((post) => (
                            <Post
                                key={post.id}
                                post={post}
                                currentUser={currentUser}
                                onDelete={removePost}
                            />
                        ))}
                    </div>

                    <div className="active-users">
                        <h3>Active Members</h3>
                        <ul>
                            {users.map((user) => (
                                <li key={user.username}>
                                    {user.username} — {user.rank || "member"}
                                    {user.username === currentUser.username && " (You)"}
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
}

export default App;
