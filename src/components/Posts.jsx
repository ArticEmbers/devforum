import React from "react";

export default function Posts({ posts, deletePost, currentUser }) {
    return (
        <div className="posts">
            {posts.length === 0 ? (
                <p>No posts yet!</p>
            ) : (
                posts.map((post) => (
                    <div className="post" key={post.id}>
                        <div className="post-header">
                            <strong>{post.author}</strong>
                            {/* Only admin (ArticEmbers) can delete */}
                            {currentUser === "ArticEmbers" && post.author === "ArticEmbers" && (
                                <button onClick={() => deletePost(post.id)}>Delete</button>
                            )}
                        </div>
                        <p>{post.content}</p>
                    </div>
                ))
            )}
        </div>
    );
}
