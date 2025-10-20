import React from "react";
import "./ActiveMembers.css";

const ActiveMembers = ({ members }) => {
    return (
        <div className="active-members">
            <h3>Active Members</h3>
            <ul>
                {members.map((member) => (
                    <li key={member.id}>{member.username} - {member.rank}</li>
                ))}
            </ul>
        </div>
    );
};

export default ActiveMembers;
