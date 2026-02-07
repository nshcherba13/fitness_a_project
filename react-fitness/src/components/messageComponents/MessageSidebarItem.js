import React from "react";
import { NavLink } from "react-router-dom";
import "../../css/messageSidebar.css";



function MessageSidebarItem({ message ,sender_photo,sender_name}) {
    const {content, timestamp,receiver_id,receiver_type, sender_id, sender_type } = message;
    const id = receiver_type=="Account" ? receiver_id :sender_id;
    const dateObj = new Date(timestamp);
    const formattedDate = dateObj.toLocaleDateString();
    const formattedTime = dateObj.toLocaleTimeString();


    return (
        <NavLink
            to={`chat`}
            className={({ isActive }) => `message-item ${isActive ? "active" : ""}`}
        >
            <div className="message-photo">
                <img src={sender_photo} alt={sender_name} />
            </div>
            <div className="message-details">
                <strong>{sender_name}</strong>
                <small className="text-muted">{content}</small>
                <small className="text-muted">
                    {formattedDate} {formattedTime}
                </small>
            </div>
        </NavLink>
    );
}

export default MessageSidebarItem;
