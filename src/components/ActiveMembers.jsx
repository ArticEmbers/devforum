// src/components/ActiveMembers.jsx
import React from "react";
import "./ActiveMembers.css";

export default function ActiveMembers({ members }) {
    return (
        <div className="active-members">
            <h3>Active Members</h3>
            <ul>
                {members.map((m) => (
                    <li key={m.username}>
                        <span className="member-name">{m.username}</span>
                        <span className={`member-role ${m.role}`}>{m.role}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
