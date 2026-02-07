import React from "react";
import Sidebar from "./components/Sidebar";
import UserProfile from "./components/UserProfile";

function HomeUser() {
    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1 p-4">
                <UserProfile />
            </div>
        </div>
    );
}

export default HomeUser;
