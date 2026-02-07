import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";
import AuthContext from "../../context/AuthProvider";

function Sidebar() {
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSignOut = async (e) => {
        e.preventDefault();

        try {
            await axios.post(
                "/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                    withCredentials: true,
                }
            );

            setAuth({});
            localStorage.removeItem("access_token");
            localStorage.removeItem("role");
            navigate("/login");
        } catch (error) {
            console.error("Error during logout:", error);
            setAuth({});
            localStorage.removeItem("access_token");
            localStorage.removeItem("role");
            navigate("/login");
        }
    };

    return (
        <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 min-vh-100">
            <ul
                className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-sm-start w-100"
                id="menu"
            >
                <li className="nav-item w-100">
                    <NavLink
                        to="/user/home"
                        className={({isActive}) =>
                            `nav-link ${isActive ? "active" : "link-dark"}`
                        }
                    >
                        <i className="fas fa-home me-2"></i>
                        <span className="ms-1 d-none d-sm-inline">Home</span>
                    </NavLink>
                </li>

                <li className="nav-item w-100">
                    <NavLink
                        to="/user/trainings"
                        className={({isActive}) =>
                            `nav-link ${isActive ? "active" : "link-dark"}`
                        }
                    >
                        <i className="fas fa-dumbbell me-2"></i>
                        <span className="ms-1 d-none d-sm-inline">Trainings</span>
                    </NavLink>
                </li>

                <li className="nav-item w-100">
                    <NavLink
                        to="/user/recipes/favorites"
                        className={({isActive}) =>
                            `nav-link ${isActive ? "active" : "link-dark"}`
                        }
                    >
                        <i className="fas fa-utensils me-2"></i>
                        <span className="ms-1 d-none d-sm-inline">Recipes</span>
                    </NavLink>
                </li>

                <li className="nav-item w-100">
                    <NavLink
                        to="/user/trainers"
                        className={({isActive}) =>
                            `nav-link ${isActive ? "active" : "link-dark"}`
                        }
                    >
                        <i className="fas fa-users me-2"></i>
                        <span className="ms-1 d-none d-sm-inline">Trainers</span>
                    </NavLink>
                </li>

                <li className="nav-item w-100">
                    <NavLink
                        to="/user/chat"
                        className={({isActive}) =>
                            `nav-link ${isActive ? "active" : "link-dark"}`
                        }
                    >
                        <i className="fas fa-comments me-2"></i>
                        <span className="ms-1 d-none d-sm-inline">Chat</span>
                    </NavLink>
                </li>

                <li className="nav-item w-100">
                    <NavLink
                        to="/user/bonuses"
                        className={({isActive}) =>
                            `nav-link ${isActive ? "active" : "link-dark"}`
                        }
                    >
                        <i className="fa-solid fa-medal me-2"></i>
                        <span className="ms-1 d-none d-sm-inline">Bonuses</span>
                    </NavLink>
                </li>

                <li className="nav-item w-100">
                    <NavLink
                        to="/user/subscription"
                        className={({isActive}) =>
                            `nav-link ${isActive ? "active" : "link-dark"}`
                        }
                    >
                        <i className="fas fa-paperclip me-2"></i>
                        <span className="ms-1 d-none d-sm-inline">Subscriptions</span>
                    </NavLink>
                </li>

                <li className="nav-item w-100">
                    <a
                        href="/login"
                        className="nav-link link-dark d-flex align-items-center"
                        onClick={handleSignOut}
                    >
                        <i className="fas fa-sign-out-alt me-2"></i>
                        <span className="ms-1 d-none d-sm-inline">Sign out</span>
                    </a>
                </li>


            </ul>
        </div>
    );
}

export default Sidebar;
