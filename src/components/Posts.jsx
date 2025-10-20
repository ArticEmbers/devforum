import React, { useState } from "react";
import "./NewPost.css";

export default function NewPost({ onAdd }) {
    const [text, setText] = useState("");

    const handleAdd = () => {
        if (text.trim() === "") return;
        onAdd(text);
        setText("");
    };

    return (
        <div className="new-post-container">
            <textarea
                placeholder="Write a post..."
                value={text}
                onChange={e => setText(e.target.value)}
            />
            <button onClick={handleAdd}>Post</button>
        </div>
    );
}
