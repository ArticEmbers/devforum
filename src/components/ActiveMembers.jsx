import React from "react";
import "./ActiveMembers.css";

const ActiveMembers = ({ members }) => (
    <div className="active-members">
        <h3>Currently Online</h3>
        {members.length === 0 ? <p>No one is online right now.</p> :
            <ul>
                {members.map(member => (
                    <li key={member.username} className={member.role === "admin" ? "admin" : ""}>
                        {member.username} <span>{member.role}</span>
                    </li>
                ))}
            </ul>
        }
    </div>
);

export default ActiveMembers;
