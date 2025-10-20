import React from "react";
import "./Posts.css";

const Posts = ({ posts, currentUser, onDelete }) => {
    return (
        <div className="posts">
            {posts.map((post) => (
                <div key={post.id} className="post">
                    <div className="post-header">
                        {post.author} <span>{post.role}</span>
                    </div>
                    <div className="post-content">{post.content}</div>
                    {/* Show delete button if admin or post owner */}
                    {(currentUser.role === "admin" || currentUser.username === post.author) && (
                        <button className="delete" onClick={() => onDelete(post.id)}>
                            Delete
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Posts;
