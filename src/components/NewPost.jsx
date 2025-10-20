import React, { useState } from "react";

export default function NewPost({ addPost }) {
    const [content, setContent] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        addPost(content);
        setContent("");
    };

    return (
        <form className="new-post" onSubmit={handleSubmit}>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write a new post..."
                rows={3}
            />
            <button type="submit">Post</button>
        </form>
    );
}
