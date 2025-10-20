// src/components/Posts.jsx
import React from "react";
import "./Posts.css";

export default function Posts({ posts, deletePost, currentUser }) {
    return (
        <div className="posts-container">
            {posts.map(post => (
                <div className="post" key={post.id}>
                    <div className="post-header">
                        <strong>{post.author}</strong>
                        {(currentUser === "Luna" || currentUser === post.author) && (
                            <button onClick={() => deletePost(post.id, post.author)}>Delete</button>
                        )}
                    </div>
                    <p>{post.content}</p>
                </div>
            ))}
        </div>
    );
}
