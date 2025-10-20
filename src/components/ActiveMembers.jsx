import React from "react";
import "./ActiveMembers.css";

export default function ActiveMembers({ members }) {
    if (!members.length) return null;

    return (
        <div className="active-members">
            <h2>Active Members</h2>
            <ul>
                {members.map((member) => (
                    <li key={member.username} className={member.role}>
                        {member.username} <span className="role">({member.role})</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
