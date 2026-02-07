import React from "react";

function Header() {
    return (
        <header>
            <div className="row align-items-center text-center text-md-start bg-gray">
                <div className="col-12 col-md-4 d-flex justify-content-start mt-2 mb-2 ms-3 mb-md-0">
                    <img src="/images/logo_big.png" alt="Club Logo" className="img-fluid club-logo" />
                </div>
            </div>
        </header>
    );
}

export default Header;
