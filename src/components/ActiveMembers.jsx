import React from "react";
import "./ActiveMembers.css";

export default function ActiveMembers({ members }) {
    return (
        <div className="active-members">
            <h3>Active Members</h3>
            <ul>
                {members.map((member) => (
                    <li key={member.username} className="member-item">
                        {member.username} <span className="member-rank">{member.rank}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
