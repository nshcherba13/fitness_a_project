import React from "react";

function Footer() {
    return (
        <footer className="container-fluid  lh-sm pb-1 footer-container">
            <p className="text-center footer-slogan fs-1 m-0 mt-3">KRAFT IS POWER</p>
            <p className="text-center footer-slogan fs-1 m-0">NOTHING ELSE MATTERS!</p>
            <p className="text-center footer-hashtag fs-1">
                <span className="bg-danger px-2">#KraftModeOn</span>
            </p>
            <p className="text-center my-4">
                <a href="facebook.com" className="text-reset text-decoration-none mx-2">
                    <i className="fa-brands fa-facebook fa-2xl footer-link-text"></i>
                </a>
                <a href="instagram.com" className="text-reset text-decoration-none mx-2">
                    <i className="fa-brands fa-instagram fa-2xl footer-link-text"></i>
                </a>
                <a href="tiktok.com" className="text-reset text-decoration-none mx-2">
                    <i className="fa-brands fa-tiktok fa-2xl footer-link-text"></i>
                </a>
            </p>
            <p className="text-center font-regular fs-6">
                <a href="#" className="text-decoration-none text-reset">
                    Privacy Policy
                </a>{" "}
                |{" "}
                <a href="#" className="text-decoration-none text-reset">
                    Legal Notice
                </a>{" "}
                |{" "}
                <a href="#" className="text-decoration-none text-reset">
                    Terms & Conditions
                </a>{" "}
                |{" "}
                <a href="#" className="text-decoration-none text-reset">
                    Contact
                </a>
            </p>
            <p className="text-center fs-6">2024-2025 © Team A* DevTeam</p>
        </footer>
    );
}

export default Footer;
