import React from "react";
import "./Posts.css";

export default function Posts({ posts, deletePost, currentUser }) {
    if (!posts.length) return <p style={{ textAlign: "center" }}>No posts yet.</p>;

    return (
        <div className="posts">
            {posts.map((post) => (
                <div key={post.id} className="post-card">
                    <div className="post-header">
                        <span className="post-author">{post.author}</span>
                        {(post.author === currentUser || currentUser === "ArticEmbers") && (
                            <button
                                className="delete-btn"
                                onClick={() => deletePost(post.id)}
                            >
                                Delete
                            </button>
                        )}
                    </div>
                    <p className="post-content">{post.content}</p>
                </div>
            ))}
        </div>
    );
}
