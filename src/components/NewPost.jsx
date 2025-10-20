import React, { useState } from "react";
import "./NewPost.css";

const NewPost = ({ onAddPost, currentUser }) => {
    const [content, setContent] = useState("");

    const handlePost = () => {
        if (content.trim() === "") return;
        onAddPost(content);
        setContent("");
    };

    return (
        <div className="new-post">
            <textarea
                placeholder={`What's on your mind, ${currentUser.username}?`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <button onClick={handlePost}>Post</button>
        </div>
    );
};

export default NewPost;
