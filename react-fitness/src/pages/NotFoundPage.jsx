import React from "react";
import {Link} from "react-router-dom";
import Header from "../components/utilityComponents/Header";
import Footer from "../components/utilityComponents/Footer";
import '../css/login_register.css';
import '../css/utility_styles.css';

function NotFoundPage() {
    return (
        <>
            <Header/>
            <div className="container-fluid my-5 utility-text">
                <div className="text-center">
                    <h1 className="utility-h1">404</h1>
                    <p className="utility-p">Oops! Page not found!</p>
                </div>
                <div className="row d-flex justify-content-center align-items-center mt-4">
                    <Link
                        to="/"
                        className="btn-font club-btn login-btn w-50 utility-link"
                    >
                        <p className="mt-4">return home</p>
                    </Link>
                </div>
            </div>
            <Footer/>
        </>

    );
}

export default NotFoundPage;
