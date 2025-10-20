import React from "react";
import "./Posts.css";

function Posts({ post, currentUser, onDelete }) {
    return (
        <div className={`post ${post.username === currentUser ? "active-user" : ""}`}>
            <p className="post-user">{post.username}</p>
            <p className="post-text">{post.text}</p>
            {post.username === currentUser && (
                <button className="delete-btn" onClick={() => onDelete(post.id, post.username)}>Delete</button>
            )}
        </div>
    );
}

export default Posts;
