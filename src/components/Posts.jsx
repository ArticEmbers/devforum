import React from "react";
import "./Posts.css";

const Posts = ({ posts, currentUser, onDelete }) => (
    <div className="posts-container">
        {posts.map(post => (
            <div className="post" key={post.id}>
                <div className="post-header">
                    {post.author} ({post.role})
                    {currentUser.username === post.author && (
                        <button className="delete" onClick={() => onDelete(post.id, post.author)}>Delete</button>
                    )}
                </div>
                <div className="post-content">{post.content}</div>
            </div>
        ))}
    </div>
);

export default Posts;
