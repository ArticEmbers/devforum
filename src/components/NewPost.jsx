// src/components/NewPost.jsx
import React, { useState } from "react";
import "./NewPost.css";

export default function NewPost({ addPost }) {
    const [content, setContent] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        addPost(content.trim());
        setContent("");
    };

    return (
        <form className="new-post-form" onSubmit={handleSubmit}>
            <textarea
                placeholder="Write something..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <button type="submit">Post</button>
        </form>
    );
}
