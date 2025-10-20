import React, { useState } from "react";
import "./NewPost.css";

export default function NewPost({ onAdd }) {
    const [content, setContent] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (content.trim() === "") return;
        onAdd(content);
        setContent("");
    };

    return (
        <form className="newpost-form" onSubmit={handleSubmit}>
            <textarea
                placeholder="Write a new post..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
            />
            <button type="submit">Post</button>
        </form>
    );
}
