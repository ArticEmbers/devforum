import React, {
    useState
}

    from "react";
import "./NewPost.css";

const NewPost = ({ onAdd }) = > {
    const [content, setContent] = useState("");
    const handleSubmit = () => {
        if (!content.trim()) return;
        onAdd(content);
        setContent("");
    }

;

return (
    <div className="new-post-container">
        <textarea
            placeholder="Write something..."
            value={content}
            onChange={e => setContent(e.target.value)}
        />
        <button onClick={handleSubmit}>Post</button>
    </div>
);
}
;

export default NewPost;
