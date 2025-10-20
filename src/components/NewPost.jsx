import React, { useState } from "react";
import "./NewPost.css";

function NewPost({ onAdd }) {
    const [text, setText] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim() === "") return;
        onAdd(text);
        setText("");
    };

    return (
        <form className="newpost-form" onSubmit={handleSubmit}>
            <textarea
                placeholder="Write your post..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button type="submit">Post</button>
        </form>
    );
}

export default NewPost;
