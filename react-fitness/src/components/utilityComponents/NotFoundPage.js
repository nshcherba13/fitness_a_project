import React from "react";
import { Link } from "react-router-dom";

//TODO Change this. It's only template, not final variant!

function NotFoundPage() {
    return (
        <div style={{ textAlign: "center", padding: "50px" }}>
            <h1 style={{ fontSize: "3rem", color: "#dc3545" }}>404</h1>
            <p style={{ fontSize: "1.5rem", color: "#6c757d" }}>Oops! Page not found.</p>
            <Link to="/" style={{ fontSize: "1.2rem", color: "#da3544", textDecoration: "none" }}>
                Go back to the Homepage
            </Link>
        </div>
    );
}

export default NotFoundPage;
