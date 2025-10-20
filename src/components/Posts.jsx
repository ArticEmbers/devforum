import React from "react";
import "./Post.css";

export default function Post({ post, onDelete, currentUser }) {
    return (
        <div className="post-card">
            <div className="post-header">
                <span className="post-author">{post.author}</span>
                <span className="post-date">{post.date}</span>
                {post.author === currentUser && (
                    <button
                        className="delete-btn"
                        onClick={() => onDelete(post.id)}
                    >
                        Delete
                    </button>
                )}
            </div>
            <div className="post-content">{post.content}</div>
        </div>
    );
}
