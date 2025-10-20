import React from "react";
import "./Post.css";

const Post = ({ post, onDelete }) => {
    return (
        <div className="post-card">
            <div className="post-header">
                <span className="post-user">{post.username}</span>
                <button className="delete-btn" onClick={() => onDelete(post.id)}>Delete</button>
            </div>
            <div className="post-content">{post.content}</div>
        </div>
    );
};

export default Post;
