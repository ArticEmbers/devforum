import React from "react";

export default function ActiveMembers({ members }) {
    return (
        <div className="active-members">
            <h3>Active Members</h3>
            <ul>
                {members.map((member) => (
                    <li key={member.username}>
                        {member.username} {member.role === "admin" && "(Admin)"}
                    </li>
                ))}
            </ul>
        </div>
    );
}
